'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Download, RefreshCw, Loader2, Settings, ToggleLeft, Sliders } from 'lucide-react';
import DropZone from '../DropZone';
import confetti from 'canvas-confetti';

export default function BlurSharpen() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fabric, setFabric] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [blurValue, setBlurValue] = useState<number>(0); // 0 to 1 range or absolute
  const [sharpenValue, setSharpenValue] = useState<number>(0); // 0 to 1 range
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFabricLoading, setIsFabricLoading] = useState(true);

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageObjectRef = useRef<any>(null);

  // Dynamic import Fabric.js to avoid SSR errors
  useEffect(() => {
    import('fabric').then((module) => {
      setFabric(module.fabric);
      setIsFabricLoading(false);
    }).catch(err => {
      console.error("Fabric load error", err);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setBlurValue(0);
    setSharpenValue(0);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setBlurValue(0);
    setSharpenValue(0);
  };

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!fabric || !previewUrl || !canvasElRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 600;
    const containerHeight = 450;

    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: '#0c0f19',
      selection: false,
    });

    setCanvas(fabricCanvas);

    // Load Image
    fabric.Image.fromURL(previewUrl, (img: any) => {
      imageObjectRef.current = img;

      // Scale to fit
      const scaleX = (containerWidth - 40) / img.width;
      const scaleY = (containerHeight - 40) / img.height;
      const scale = Math.min(scaleX, scaleY, 1);

      img.set({
        originX: 'center',
        originY: 'center',
        left: containerWidth / 2,
        top: containerHeight / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });

      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    }, { crossOrigin: 'anonymous' });

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [fabric, previewUrl]);

  // Apply filters dynamically when sliders change
  const applyFilters = () => {
    if (!canvas || !imageObjectRef.current || !fabric) return;

    const img = imageObjectRef.current;
    img.filters = [];

    // 1. Blur Filter
    if (blurValue > 0) {
      // fabric.Image.filters.Blur takes a blur parameter from 0 to 1
      const blurFilter = new fabric.Image.filters.Blur({
        blur: blurValue / 100, // scaling down to an optimal float value
      });
      img.filters.push(blurFilter);
    }

    // 2. Sharpen Filter (Convolution Matrix)
    if (sharpenValue > 0) {
      // A standard 3x3 sharpen convolution matrix.
      // We scale the strength based on sharpenValue.
      const k = sharpenValue / 10;
      const matrix = [
         0,     -k,       0,
        -k, 1 + 4 * k,   -k,
         0,     -k,       0
      ];

      const sharpenFilter = new fabric.Image.filters.Convolute({
        matrix: matrix,
      });
      img.filters.push(sharpenFilter);
    }

    // Apply filters and re-render
    img.applyFilters();
    canvas.renderAll();
  };

  // Trigger filter application when values change
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 150); // slight debounce for smooth dragging performance

    return () => clearTimeout(timer);
  }, [blurValue, sharpenValue, canvas]);

  // Export processed image
  const handleExport = () => {
    if (!canvas || !imageObjectRef.current || !selectedFile) return;
    setIsProcessing(true);

    try {
      // Export at original resolution or current canvas scale
      // Using canvas.toDataURL allows instant local export
      const dataUrl = canvas.toDataURL({
        format: selectedFile.type === 'image/png' ? 'png' : 'jpeg',
        quality: 0.95,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `focused_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#06b6d4'],
      });
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {!selectedFile ? (
        <DropZone
          onFileSelect={handleFileSelect}
          label="Upload an image to adjust blur & sharpen parameters"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-brand-primary" />
                  <span>Focus Studio</span>
                </h3>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  Reset
                </button>
              </div>

              {/* Blur Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Gaussian Blur
                  </label>
                  <span className="text-sm font-bold text-brand-primary">{(blurValue / 10).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={blurValue}
                  onChange={(e) => {
                    setBlurValue(parseInt(e.target.value));
                    setSharpenValue(0); // Mutually exclusive filters to keep visual coherence
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>None</span>
                  <span>Heavy Defocus</span>
                </div>
              </div>

              {/* Sharpen Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    High-Pass Sharpen
                  </label>
                  <span className="text-sm font-bold text-brand-secondary">{(sharpenValue / 10).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sharpenValue}
                  onChange={(e) => {
                    setSharpenValue(parseInt(e.target.value));
                    setBlurValue(0); // Mutually exclusive
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>None</span>
                  <span>Ultra Crisp Edges</span>
                </div>
              </div>

              {/* Operations Guidelines */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal font-light">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <Eye className="w-3.5 h-3.5 text-brand-secondary" />
                  Real-time Canvas Rendering
                </div>
                Adjust the sliders to apply mathematical filters directly onto the canvas pixels. To keep high fidelity, blur and sharpening are applied as separate, high-performance visual stacks.
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={handleExport}
                disabled={isProcessing || isFabricLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Canvas...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Processed Image</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Viewport Canvas Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Workspace Viewport
            </h3>

            <div
              ref={containerRef}
              className="w-full h-[450px] glass-panel rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden bg-black/10"
            >
              {isFabricLoading && (
                <div className="absolute inset-0 bg-[#0c0f19] flex items-center justify-center z-15">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs text-gray-500 font-light">Loading Vector Canvas...</span>
                  </div>
                </div>
              )}
              <canvas ref={canvasElRef} className="absolute inset-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
