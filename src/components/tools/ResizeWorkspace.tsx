'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, Download, Loader2, ArrowLeft, RefreshCw, Sliders, Settings, Lock, Unlock, CheckCircle } from 'lucide-react';
import CompareSlider from '@/components/CompareSlider';
import DropZone from '@/components/DropZone';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface ResizeWorkspaceProps {
  defaultWidth?: number;
  defaultHeight?: number;
  title: string;
  subtitle: string;
  pageSuffix?: string;
  presetRatio?: string;
  specialInstructions?: string[];
}

export default function ResizeWorkspace({
  defaultWidth,
  defaultHeight,
  title,
  subtitle,
  pageSuffix = "Image Resizer",
  presetRatio,
  specialInstructions
}: ResizeWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Resizing modes and states
  const [resizeMode, setResizeMode] = useState<'percent' | 'custom'>((defaultWidth || defaultHeight) ? 'custom' : 'percent');
  const [scalePercent, setScalePercent] = useState<number>(50);
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Original & current dimensions & file stats
  const [sizeBefore, setSizeBefore] = useState<number>(0);
  const [sizeAfter, setSizeAfter] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [currentDims, setCurrentDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSizeBefore(file.size);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setSizeAfter(0);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
      
      // Setup initial target dimensions based on props or defaults
      if (defaultWidth && defaultHeight) {
        setTargetWidth(defaultWidth.toString());
        setTargetHeight(defaultHeight.toString());
        setCurrentDims({ w: defaultWidth, h: defaultHeight });
      } else if (defaultWidth) {
        setTargetWidth(defaultWidth.toString());
        const calculatedHeight = Math.round(defaultWidth / (img.width / img.height));
        setTargetHeight(calculatedHeight.toString());
        setCurrentDims({ w: defaultWidth, h: calculatedHeight });
      } else if (defaultHeight) {
        setTargetHeight(defaultHeight.toString());
        const calculatedWidth = Math.round(defaultHeight * (img.width / img.height));
        setTargetWidth(calculatedWidth.toString());
        setCurrentDims({ w: calculatedWidth, h: defaultHeight });
      } else {
        const initialW = Math.round(img.width * (scalePercent / 100));
        const initialH = Math.round(img.height * (scalePercent / 100));
        setTargetWidth(initialW.toString());
        setTargetHeight(initialH.toString());
        setCurrentDims({ w: initialW, h: initialH });
      }
      
      URL.revokeObjectURL(img.src);
    };
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setSizeBefore(0);
    setSizeAfter(0);
    setOriginalDims(null);
    setCurrentDims(null);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Proportional or custom resizing execution
  const scaleImage = async (file: File, w: number, h: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas creation failed'));
            return;
          }

          // Render image using high-quality rendering options
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve({ blob, url: URL.createObjectURL(blob) });
              else reject(new Error('Blob creation failed'));
            },
            file.type || 'image/jpeg',
            0.92
          );
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const executeResize = async () => {
    if (!selectedFile || !currentDims) return;
    setIsProcessing(true);

    try {
      const result = await scaleImage(selectedFile, currentDims.w, currentDims.h);
      setResultUrl(result.url);
      setSizeAfter(result.blob.size);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Recalculate dimensions dynamically on slider/input changes
  useEffect(() => {
    if (!originalDims) return;

    if (resizeMode === 'percent') {
      const w = Math.round(originalDims.w * (scalePercent / 100));
      const h = Math.round(originalDims.h * (scalePercent / 100));
      setTargetWidth(w.toString());
      setTargetHeight(h.toString());
      setCurrentDims({ w, h });
    }
  }, [scalePercent, resizeMode, originalDims]);

  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    if (!originalDims) return;

    const numericW = parseInt(val, 10);
    if (isNaN(numericW) || numericW <= 0) return;

    if (lockRatio) {
      const ratio = originalDims.w / originalDims.h;
      const calculatedH = Math.round(numericW / ratio);
      setTargetHeight(calculatedH.toString());
      setCurrentDims({ w: numericW, h: calculatedH });
    } else {
      const numericH = parseInt(targetHeight, 10) || originalDims.h;
      setCurrentDims({ w: numericW, h: numericH });
    }
  };

  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    if (!originalDims) return;

    const numericH = parseInt(val, 10);
    if (isNaN(numericH) || numericH <= 0) return;

    if (lockRatio) {
      const ratio = originalDims.w / originalDims.h;
      const calculatedW = Math.round(numericH * ratio);
      setTargetWidth(calculatedW.toString());
      setCurrentDims({ w: calculatedW, h: numericH });
    } else {
      const numericW = parseInt(targetWidth, 10) || originalDims.w;
      setCurrentDims({ w: numericW, h: numericH });
    }
  };

  // Debounced auto-trigger resize on parameter changes
  useEffect(() => {
    if (selectedFile && currentDims) {
      const timer = setTimeout(() => {
        executeResize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentDims, selectedFile]);

  const triggerDownload = () => {
    if (!resultUrl || !selectedFile || !currentDims) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `resized_${currentDims.w}x${currentDims.h}_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8b5cf6', '#06b6d4', '#ec4899'],
    });
  };

  const renderSEOContent = () => {
    let seoTitle = `Proportional Image Resizing Online`;
    let seoIntro = `Change image dimensions in pixels quickly without stretching or distortion.`;
    
    let articles = [
      {
        title: "How to Resize an Image in Pixels",
        body: "To resize an image, upload your photo to our client-side workspace. Choose 'By Dimensions' mode, key in your target width or height, and check 'Lock aspect ratio' to scale height and width proportionally. Download the optimized asset instantly."
      },
      {
        title: "Resize Image Without Quality Loss",
        body: "Downscaling dimensions is the safest method to compress heavy megapixel assets. VectraCompress uses high-performance canvas bilinear interpolation to redraw your images with sharp definitions and smooth color gradients."
      }
    ];

    if (defaultWidth && defaultHeight) {
      seoTitle = `Resize Image to Exactly ${defaultWidth}x${defaultHeight}`;
      seoIntro = `Direct dimension mapping tool to resize your files to width: ${defaultWidth}px and height: ${defaultHeight}px.`;
      articles[0] = {
        title: `How to Make an Image ${defaultWidth}x${defaultHeight} Pixels`,
        body: `Upload your photograph here and our tool automatically pre-sets the outputs to exactly ${defaultWidth}px by ${defaultHeight}px. You can crop margins beforehand if the original aspect ratio differs from the ${defaultWidth}:${defaultHeight} canvas format.`
      };
    }

    return (
      <div className="border-t border-white/5 pt-10 mt-10 space-y-6 text-left">
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            {seoTitle}
          </h3>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            {seoIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {articles.map((art, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
                {art.title}
              </h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {art.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 flex flex-col justify-between selection:bg-brand-primary/30 relative overflow-hidden select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="p-5 border-b border-white/5 bg-black/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <div className="bg-brand-primary p-2 rounded-lg">
              <Minimize2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-white tracking-wide">
              ResizePixel Online
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            {pageSuffix}
          </span>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 flex items-center py-6 px-4">
        <div className="max-w-3xl w-full mx-auto">
          
          {!selectedFile ? (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="space-y-2.5">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm mx-auto">
                  {subtitle}
                </p>
              </div>

              <DropZone
                onFileSelect={handleFileSelect}
                label="Tap to upload image"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full animate-fade-in">
              
              {/* Special Instructions Banner */}
              {specialInstructions && specialInstructions.length > 0 && (
                <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/20 p-4 rounded-2xl flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <div className="text-xs leading-normal font-light text-gray-300">
                    <span className="font-bold text-white block mb-0.5 uppercase tracking-wide text-[10px]">Guidelines</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {specialInstructions.map((inst, index) => (
                        <li key={index}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="w-full">
                {resultUrl && previewUrl ? (
                  <CompareSlider
                    original={previewUrl}
                    modified={resultUrl}
                    height="h-[300px] sm:h-[400px]"
                  />
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px] glass-panel rounded-3xl border border-white/10 flex items-center justify-center bg-black/10">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-5">
                
                {/* Mode Toggles */}
                <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setResizeMode('percent')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                      resizeMode === 'percent' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400'
                    }`}
                  >
                    <span>⚙️ By Percentage</span>
                  </button>
                  <button
                    onClick={() => setResizeMode('custom')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                      resizeMode === 'custom' ? 'bg-brand-secondary text-white shadow-md' : 'text-gray-400'
                    }`}
                  >
                    <span>✂️ By Dimensions</span>
                  </button>
                </div>

                {/* Dimensions Output Stats */}
                <div className="flex justify-between items-center text-xs font-semibold px-1 text-gray-400">
                  {originalDims && (
                    <span>Original: {originalDims.w} x {originalDims.h} px ({formatSize(sizeBefore)})</span>
                  )}
                  {resultUrl && currentDims && (
                    <span className="text-brand-secondary font-bold">
                      Resized: {currentDims.w} x {currentDims.h} px ({formatSize(sizeAfter)})
                    </span>
                  )}
                </div>

                {/* 1. By Percentage Slider */}
                {resizeMode === 'percent' && (
                  <div className="space-y-3.5 pt-1">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Scale Dimensions
                      </span>
                      <span className="text-sm font-extrabold text-brand-secondary">
                        {scalePercent}%
                      </span>
                    </div>
                    <div className="pt-1">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={scalePercent}
                        onChange={(e) => setScalePercent(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                      />
                      <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase pt-1 px-1">
                        <span>10% Scale</span>
                        <span>100% Original</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. By Dimensions Inputs */}
                {resizeMode === 'custom' && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Width (px)</label>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-brand-primary rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Height (px)</label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-brand-secondary rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setLockRatio(!lockRatio)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold w-fit transition-all ${
                        lockRatio ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>Lock Aspect Ratio</span>
                    </button>
                  </div>
                )}

                {/* Download / Processing actions */}
                <div className="pt-2 flex flex-col gap-3">
                  {resultUrl ? (
                    <button
                      onClick={triggerDownload}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:opacity-95 transition-all"
                    >
                      <Download className="w-5 h-5 animate-bounce" />
                      <span>Download Optimized Image</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-white/5 text-gray-500 py-4 rounded-2xl font-bold text-sm cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Rescaling dimensions...</span>
                    </button>
                  )}

                  <button
                    onClick={clearAll}
                    className="w-full py-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 font-bold hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Upload New Image</span>
                  </button>
                </div>

              </div>

              {renderSEOContent()}

            </div>
          )}

        </div>
      </main>

      <footer className="p-5 border-t border-white/5 bg-black/10 text-center text-[10px] text-gray-600 font-light">
        ResizePixel Online. Free, secure, client-side image optimization.
      </footer>
    </div>
  );
}
