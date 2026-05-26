'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Minimize2, Download, RefreshCw, Loader2, Settings, Server, Cpu } from 'lucide-react';
import DropZone from '../DropZone';
import CompareSlider from '../CompareSlider';
import confetti from 'canvas-confetti';

export default function Compressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [engine, setEngine] = useState<'client' | 'server'>('client');
  const [resizeWidth, setResizeWidth] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [sizeBefore, setSizeBefore] = useState<number>(0);
  const [sizeAfter, setSizeAfter] = useState<number>(0);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setSizeBefore(0);
    setSizeAfter(0);
  };

  // Client-side canvas compression
  const compressClientSide = (file: File, quality: number, width: number | ''): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let targetWidth = img.width;
          let targetHeight = img.height;

          if (width && typeof width === 'number' && width < img.width) {
            const scale = width / img.width;
            targetWidth = width;
            targetHeight = img.height * scale;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context could not be created'));
            return;
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Compress to JPEG/WebP based on original file type or defaults
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({ blob, url });
              } else {
                reject(new Error('Blob creation failed'));
              }
            },
            outputType,
            quality / 100
          );
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Server-side Sharp compression
  const compressServerSide = async (file: File, quality: number, width: number | ''): Promise<{ blob: Blob; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality.toString());
    if (width) {
      formData.append('maxWidth', width.toString());
    }

    const res = await fetch('/api/compress', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed server-side compression');
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return { blob, url };
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      let result;
      if (engine === 'client') {
        result = await compressClientSide(selectedFile, quality, resizeWidth);
      } else {
        result = await compressServerSide(selectedFile, quality, resizeWidth);
      }

      setResultUrl(result.url);
      setSizeAfter(result.blob.size);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#8b5cf6'],
      });
    } catch (err: any) {
      alert(`Compression error: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const savingPercentage = sizeBefore && sizeAfter 
    ? Math.max(0, Math.round(((sizeBefore - sizeAfter) / sizeBefore) * 100))
    : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {!selectedFile ? (
        <DropZone
          onFileSelect={handleFileSelect}
          label="Upload an image to optimize & compress"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-primary" />
                  <span>Compression Settings</span>
                </h3>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  Reset
                </button>
              </div>

              {/* Mode Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Processing Engine
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setEngine('client')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      engine === 'client'
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Client (Fast)</span>
                  </button>
                  <button
                    onClick={() => setEngine('server')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      engine === 'server'
                        ? 'bg-brand-secondary text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>Server (Sharp)</span>
                  </button>
                </div>
              </div>

              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Compression Quality
                  </label>
                  <span className="text-sm font-bold text-brand-primary">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>Small size (Low quality)</span>
                  <span>Large size (High quality)</span>
                </div>
              </div>

              {/* Max Width Limit */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Resize Width (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Original Width"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                    PX
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-normal font-light">
                  Optionally scale down the image's overall width to save additional space. Aspect ratio is preserved automatically.
                </p>
              </div>

              {/* File Info Card */}
              <div className="border border-white/5 bg-black/20 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Original Size:</span>
                  <span className="text-gray-200 font-bold">{formatSize(sizeBefore)}</span>
                </div>
                {sizeAfter > 0 && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Optimized Size:</span>
                      <span className="text-brand-secondary font-extrabold">{formatSize(sizeAfter)}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-white/5 pt-2 mt-2">
                      <span className="text-gray-400 font-medium">Savings:</span>
                      <span className="text-emerald-400 font-extrabold">-{savingPercentage}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Compressing...</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-5 h-5" />
                    <span>Compress Image</span>
                  </>
                )}
              </button>

              {resultUrl && (
                <a
                  href={resultUrl}
                  download={`optimized_${selectedFile.name}`}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl font-semibold transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Optimized Image</span>
                </a>
              )}
            </div>
          </div>

          {/* Viewport/Compare Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Visual Workspace & Comparison
            </h3>

            {resultUrl && previewUrl ? (
              <CompareSlider
                original={previewUrl}
                modified={resultUrl}
                height="h-[500px]"
              />
            ) : (
              <div className="w-full h-[500px] glass-panel rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden bg-black/10">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Original Upload"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <span className="text-sm text-gray-500 font-light">No image uploaded</span>
                )}
                <div className="absolute right-4 bottom-4 bg-white/5 border border-white/10 px-3 py-1 rounded-md text-xs text-gray-400">
                  Preview Canvas
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
