'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Minimize2, Download, Loader2, ArrowLeftRight, ArrowLeft } from 'lucide-react';
import CompareSlider from '@/components/CompareSlider';
import DropZone from '@/components/DropZone';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ResizePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Settings
  const [scalePercent, setScalePercent] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stats
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
      setCurrentDims({ w: Math.round(img.width * (scalePercent / 100)), h: Math.round(img.height * (scalePercent / 100)) });
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

  // Client-side canvas dimension resizing
  const scaleImage = async (file: File, scale: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const factor = scale / 100;
          const w = img.width * factor;
          const h = img.height * factor;
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas creation failed'));
            return;
          }

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
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const result = await scaleImage(selectedFile, scalePercent);
      setResultUrl(result.url);
      setSizeAfter(result.blob.size);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const timer = setTimeout(() => {
        executeResize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [scalePercent, selectedFile]);

  // Update proportional dimension display
  useEffect(() => {
    if (originalDims) {
      const scale = scalePercent / 100;
      setCurrentDims({
        w: Math.round(originalDims.w * scale),
        h: Math.round(originalDims.h * scale),
      });
    }
  }, [scalePercent, originalDims]);

  const triggerDownload = () => {
    if (!resultUrl || !selectedFile) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `resized_${scalePercent}pct_${selectedFile.name}`;
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
              AuraResize
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Reduce by Resizing
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
                  Scale Dimensions
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm mx-auto">
                  Downscale pixel width and height proportionally using smooth bilinear interpolation to shrink file size.
                </p>
              </div>

              <DropZone
                onFileSelect={handleFileSelect}
                label="Tap to upload image"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full animate-fade-in">
              
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
                
                {/* 1-Line Stats */}
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

                {/* Scale factor sliders */}
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

                {/* Download */}
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
            </div>
          )}

        </div>
      </main>

      <footer className="p-5 border-t border-white/5 bg-black/10 text-center text-[10px] text-gray-600 font-light">
        AuraResize. Free, secure, client-side browser optimization.
      </footer>
    </div>
  );
}
