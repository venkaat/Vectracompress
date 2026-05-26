'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Minimize2, Download, Loader2, RefreshCw, ArrowLeftRight, ArrowLeft } from 'lucide-react';
import CompareSlider from '@/components/CompareSlider';
import DropZone from '@/components/DropZone';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Settings
  const [targetSizeKb, setTargetSizeKb] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stats
  const [sizeBefore, setSizeBefore] = useState<number>(0);
  const [sizeAfter, setSizeAfter] = useState<number>(0);

  const presets = [50, 100, 200, 500] as const;

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

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Iterative binary-search quality search
  const compressImage = async (file: File, targetKb: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = async () => {
          const targetSizeBytes = targetKb * 1024;

          if (file.size <= targetSizeBytes) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(
                (blob) => {
                  if (blob) resolve({ blob, url: URL.createObjectURL(blob) });
                  else reject(new Error('Compression failed'));
                },
                'image/jpeg',
                0.85
              );
            }
            return;
          }

          let lowQuality = 10;
          let highQuality = 92;
          let bestBlob: Blob | null = null;
          let bestUrl: string | null = null;
          let scaleFactor = 1.0;

          for (let pass = 0; pass < 2; pass++) {
            lowQuality = 12;
            highQuality = pass === 0 ? 92 : 60;

            for (let i = 0; i < 5; i++) {
              const currentQuality = (lowQuality + highQuality) / 2;
              const canvas = document.createElement('canvas');
              const w = img.width * scaleFactor;
              const h = img.height * scaleFactor;
              canvas.width = w;
              canvas.height = h;

              const ctx = canvas.getContext('2d');
              if (!ctx) continue;
              ctx.drawImage(img, 0, 0, w, h);

              const outputBlob = await new Promise<Blob | null>((res) => {
                canvas.toBlob(
                  (b) => res(b),
                  file.type === 'image/png' ? 'image/png' : 'image/jpeg',
                  currentQuality / 100
                );
              });

              if (outputBlob && outputBlob.size <= targetSizeBytes) {
                bestBlob = outputBlob;
                lowQuality = currentQuality + 1;
              } else {
                highQuality = currentQuality - 1;
              }
            }

            if (bestBlob) break;

            if (pass === 0) {
              scaleFactor = 0.75;
            }
          }

          if (!bestBlob) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * 0.4;
            canvas.height = img.height * 0.4;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const outputBlob = await new Promise<Blob | null>((res) => {
                canvas.toBlob((b) => res(b), 'image/jpeg', 0.1);
              });
              if (outputBlob) bestBlob = outputBlob;
            }
          }

          if (bestBlob) {
            bestUrl = URL.createObjectURL(bestBlob);
            resolve({ blob: bestBlob, url: bestUrl });
          } else {
            reject(new Error('Compression failed'));
          }
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const executeCompression = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const result = await compressImage(selectedFile, targetSizeKb);
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
        executeCompression();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [targetSizeKb, selectedFile]);

  const triggerDownload = () => {
    if (!resultUrl || !selectedFile) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `compressed_${targetSizeKb}kb_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 85,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#8b5cf6', '#06b6d4', '#ec4899'],
    });
  };

  const savingPercentage = sizeBefore && sizeAfter 
    ? Math.max(0, Math.round(((sizeBefore - sizeAfter) / sizeBefore) * 100))
    : 0;

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
              AuraCompress
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Reduce by Compression
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
                  Compress File Size
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm mx-auto">
                  Shrink your image to your exact KB limit. Adjust target limits and download instantly, 100% privately.
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
                  <span className="truncate max-w-[150px]">Original: {formatSize(sizeBefore)}</span>
                  <div className="flex items-center gap-1.5 text-brand-primary">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>
                      {sizeAfter > 0 ? `Optimized: ${formatSize(sizeAfter)} (-${savingPercentage}%)` : 'Optimizing...'}
                    </span>
                  </div>
                </div>

                {/* Preset Targets & Sliders */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Target File Size
                    </span>
                    <span className="text-sm font-extrabold text-brand-primary">
                      {targetSizeKb} KB
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((p) => (
                      <button
                        key={p}
                        onClick={() => setTargetSizeKb(p)}
                        className={`py-3.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                          targetSizeKb === p
                            ? 'border-brand-primary bg-brand-primary/10 text-white shadow-lg'
                            : 'border-white/5 bg-black/20 text-gray-400'
                        }`}
                      >
                        <span className="text-sm font-black">{p}</span>
                        <span className="text-[9px] uppercase font-bold text-gray-500 mt-0.5">KB</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="range"
                      min="10"
                      max="1500"
                      step="10"
                      value={targetSizeKb}
                      onChange={(e) => setTargetSizeKb(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase pt-1 px-1">
                      <span>10 KB</span>
                      <span>1.5 MB</span>
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
                      <span>Running optimization passes...</span>
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
        AuraCompress. Free, secure, client-side browser optimization.
      </footer>
    </div>
  );
}
