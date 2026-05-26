'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scissors, Download, RefreshCw, Loader2, Sparkles, Wand2, Paintbrush, ShieldAlert } from 'lucide-react';
import DropZone from '../DropZone';
import confetti from 'canvas-confetti';

export default function BgRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // AI state
  const [removeBg, setRemoveBg] = useState<any>(null);
  const [isAiLoaded, setIsAiLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  
  // Magic Wand states
  const [wandTolerance, setWandTolerance] = useState<number>(30);
  const [activeTool, setActiveTool] = useState<'ai' | 'wand'>('ai');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  // Dynamically load @imgly/background-removal to avoid SSR build errors
  useEffect(() => {
    import('@imgly/background-removal')
      .then((module) => {
        setRemoveBg(() => module.default);
        setIsAiLoaded(true);
      })
      .catch((err) => {
        console.error("AI Background Removal loading error:", err);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResultUrl(null);
    
    // Draw original image on canvas for magic wand operations
    const img = new Image();
    img.src = url;
    img.onload = () => {
      sourceImageRef.current = img;
      drawCanvasImage(img);
    };
  };

  const drawCanvasImage = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Maintain aspect ratio inside viewport
    const containerWidth = canvas.parentElement?.clientWidth || 600;
    const containerHeight = 400;

    const scaleX = containerWidth / img.width;
    const scaleY = containerHeight / img.height;
    const scale = Math.min(scaleX, scaleY, 1);

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
  };

  // 1. AI Background Removal
  const handleAiRemove = async () => {
    if (!selectedFile || !removeBg) return;
    setIsProcessing(true);
    setProgressMsg('Initializing local model...');

    try {
      const blob = await removeBg(selectedFile, {
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);
          setProgressMsg(`Processing ${key.replace('fetch:', 'downloading model')}: ${percent}%`);
        },
      });

      const url = URL.createObjectURL(blob);
      setResultUrl(url);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#ec4899'],
      });
    } catch (err: any) {
      console.error(err);
      alert(`AI Extraction failed. Falling back to magic wand: ${err.message || err}`);
      setActiveTool('wand');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  // 2. Color Magic Wand (Chroma-Key Tool)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'wand' || !canvasRef.current || !sourceImageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    // Get Target Color (RGBA) of clicked pixel
    const targetIdx = (y * canvas.width + x) * 4;
    const targetR = pixels[targetIdx];
    const targetG = pixels[targetIdx + 1];
    const targetB = pixels[targetIdx + 2];

    // Erase matching colors based on tolerance threshold
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Calculate Euclidean distance in color space
      const distance = Math.sqrt(
        Math.pow(r - targetR, 2) +
        Math.pow(g - targetG, 2) +
        Math.pow(b - targetB, 2)
      );

      if (distance <= wandTolerance) {
        pixels[i + 3] = 0; // Set Alpha to 0 (make transparent)
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Save output result url from canvas
    canvas.toBlob((blob) => {
      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
      }
    }, 'image/png');
  };

  const handleDownload = () => {
    if (!resultUrl || !selectedFile) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `extracted_${selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'))}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {!selectedFile ? (
        <DropZone
          onFileSelect={handleFileSelect}
          label="Upload an image to remove background layers"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-brand-primary" />
                  <span>BG Eraser Studio</span>
                </h3>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  New Image
                </button>
              </div>

              {/* Extraction Tool Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Extraction Mode
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setActiveTool('ai')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTool === 'ai'
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Smart AI (Local)</span>
                  </button>
                  <button
                    onClick={() => setActiveTool('wand')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTool === 'wand'
                        ? 'bg-brand-secondary text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Magic Wand</span>
                  </button>
                </div>
              </div>

              {/* AI Details */}
              {activeTool === 'ai' && (
                <div className="space-y-4">
                  <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal font-light">
                    <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                      Neural Network Extraction
                    </div>
                    Uses an in-browser WebAssembly neural network (ONNX) to split subjects from backgrounds automatically. Safe, private, and offline.
                    {!isAiLoaded && (
                      <div className="flex items-center gap-2 text-brand-primary font-semibold mt-3 animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Downloading WASM model engine...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Magic Wand Control */}
              {activeTool === 'wand' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Color Distance Tolerance
                      </label>
                      <span className="text-sm font-bold text-brand-secondary">{wandTolerance}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      value={wandTolerance}
                      onChange={(e) => setWandTolerance(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                    />
                  </div>

                  <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal font-light">
                    <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                      <Wand2 className="w-3.5 h-3.5 text-brand-secondary" />
                      Color Threshold Extractor
                    </div>
                    Click anywhere inside the preview canvas on the right to erase matching colors. Increase the tolerance slider to erase wider shades of that color.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              {activeTool === 'ai' && (
                <button
                  onClick={handleAiRemove}
                  disabled={isProcessing || !isAiLoaded}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="truncate max-w-[200px]">{progressMsg || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-5 h-5" />
                      <span>Extract Background</span>
                    </>
                  )}
                </button>
              )}

              {resultUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Extracted Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Viewport Canvas Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Workspace Viewport
            </h3>

            <div className="w-full h-[450px] glass-panel rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c0f19]">
              {/* Show original preview, or interactive canvas, or result */}
              {activeTool === 'wand' ? (
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="max-w-full max-h-full cursor-crosshair border border-white/5 shadow-2xl rounded-lg"
                />
              ) : resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Extracted Background"
                  className="max-w-full max-h-full object-contain p-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Original Upload"
                  className="max-w-full max-h-full object-contain p-4"
                />
              ) : (
                <span className="text-sm text-gray-500 font-light">No image uploaded</span>
              )}
              
              <div className="absolute right-4 bottom-4 bg-white/5 border border-white/10 px-3 py-1 rounded-md text-xs text-gray-400 backdrop-blur-sm">
                {activeTool === 'wand' ? 'Click Canvas to Erase' : resultUrl ? 'Transparent Output' : 'Original Input'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
