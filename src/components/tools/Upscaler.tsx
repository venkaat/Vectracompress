'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, Download, RefreshCw, Loader2, Settings, Zap, Compass, CheckCircle } from 'lucide-react';
import DropZone from '../DropZone';
import CompareSlider from '../CompareSlider';
import confetti from 'canvas-confetti';

export default function Upscaler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [factor, setFactor] = useState<2 | 4>(2);
  const [method, setMethod] = useState<'sharp' | 'canvas'>('sharp');
  const [applySharpen, setApplySharpen] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setDimensions(null);

    // Read Dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setDimensions({ w: img.width, h: img.height });
      URL.revokeObjectURL(img.src);
    };
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setDimensions(null);
  };

  // Client-side upscaling via canvas
  const upscaleClientSide = (file: File, factor: 2 | 4): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const w = img.width * factor;
          const h = img.height * factor;
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context could not be created'));
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({ blob, url });
              } else {
                reject(new Error('Blob creation failed'));
              }
            },
            file.type || 'image/jpeg',
            0.95
          );
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Server-side upscaling via sharp
  const upscaleServerSide = async (file: File, factor: 2 | 4, sharpen: boolean): Promise<{ blob: Blob; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('factor', factor.toString());
    formData.append('sharpen', sharpen ? 'true' : 'false');

    const res = await fetch('/api/upscale', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed server-side upscaling');
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return { blob, url };
  };

  const handleUpscale = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      let result;
      if (method === 'canvas') {
        result = await upscaleClientSide(selectedFile, factor);
      } else {
        result = await upscaleServerSide(selectedFile, factor, applySharpen);
      }

      setResultUrl(result.url);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#06b6d4'],
      });
    } catch (err: any) {
      alert(`Upscale failed: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {!selectedFile ? (
        <DropZone
          onFileSelect={handleFileSelect}
          label="Upload an image to upscale & sharpen"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-primary" />
                  <span>Upscaler Controls</span>
                </h3>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  Clear
                </button>
              </div>

              {/* Resolution Factor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Scale Multiplier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[2, 4].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFactor(f as 2 | 4)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        factor === f
                          ? 'border-brand-primary bg-brand-primary/10 text-white'
                          : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl font-bold">{f}x</span>
                      <span className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">
                        Resolution
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upscaling Method */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Scaling Engine
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setMethod('sharp')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      method === 'sharp'
                        ? 'border-brand-primary bg-brand-primary/5 text-white'
                        : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Compass className={`w-4 h-4 ${method === 'sharp' ? 'text-brand-primary' : 'text-gray-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">Sharp Lanczos3 (Premium)</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">High-quality, server processed interpolation</div>
                      </div>
                    </div>
                    {method === 'sharp' && <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />}
                  </button>

                  <button
                    onClick={() => setMethod('canvas')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      method === 'canvas'
                        ? 'border-brand-secondary bg-brand-secondary/5 text-white'
                        : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className={`w-4 h-4 ${method === 'canvas' ? 'text-brand-secondary' : 'text-gray-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">Bilinear Canvas (Instant)</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Fast, secure local browser processing</div>
                      </div>
                    </div>
                    {method === 'canvas' && <CheckCircle className="w-4 h-4 text-brand-secondary flex-shrink-0" />}
                  </button>
                </div>
              </div>

              {/* Edge Sharpen Option (Server only) */}
              {method === 'sharp' && (
                <div className="flex items-center justify-between bg-black/20 border border-white/5 p-3 rounded-xl">
                  <div>
                    <div className="text-xs font-semibold text-white">Apply Smart Sharpen</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Restores crisp edges post-upscale</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={applySharpen}
                    onChange={(e) => setApplySharpen(e.target.checked)}
                    className="w-4 h-4 accent-brand-primary cursor-pointer"
                  />
                </div>
              )}

              {/* Dimension Metrics */}
              {dimensions && (
                <div className="border border-white/5 bg-black/20 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Original Dimensions:</span>
                    <span className="text-gray-200 font-semibold">{dimensions.w} x {dimensions.h} px</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-white/5 pt-2 mt-2">
                    <span className="text-gray-400 font-medium">Upscaled Dimensions:</span>
                    <span className="text-brand-secondary font-extrabold">
                      {dimensions.w * factor} x {dimensions.h * factor} px
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <button
                onClick={handleUpscale}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Upscaling...</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    <span>Upscale Image</span>
                  </>
                )}
              </button>

              {resultUrl && (
                <a
                  href={resultUrl}
                  download={`upscaled_${factor}x_${selectedFile.name}`}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl font-semibold transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Upscaled Image</span>
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
