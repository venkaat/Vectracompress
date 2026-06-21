'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, Download, Loader2, CheckCircle, RefreshCw, X, ArrowLeftRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import CompareSlider from '@/components/CompareSlider';
import DropZone from '@/components/DropZone';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface ConverterWorkspaceProps {
  defaultTargetFormat: 'png' | 'jpeg' | 'webp' | 'avif';
  title: string;
  subtitle: string;
  specialInstructions?: string[];
  pageSuffix?: string;
  seoSection?: React.ReactNode;
}

export default function ConverterWorkspace({
  defaultTargetFormat,
  title,
  subtitle,
  specialInstructions,
  pageSuffix = 'Format Converter',
  seoSection,
}: ConverterWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp' | 'avif'>(defaultTargetFormat);
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Format capabilities checks
  const [supportedFormats, setSupportedFormats] = useState<{ webp: boolean; avif: boolean }>({
    webp: true,
    avif: false,
  });
  const [actualFormatUsed, setActualFormatUsed] = useState<string>('');
  const [wasFallbackUsed, setWasFallbackUsed] = useState<boolean>(false);

  // Diagnostics
  const [sizeBefore, setSizeBefore] = useState<number>(0);
  const [sizeAfter, setSizeAfter] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  // Sync default target format prop
  useEffect(() => {
    setTargetFormat(defaultTargetFormat);
  }, [defaultTargetFormat]);

  // Check browser format encoding support on mount
  useEffect(() => {
    const checkSupport = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;

      const checkFormat = (format: string): Promise<boolean> => {
        return new Promise((resolve) => {
          try {
            canvas.toBlob(
              (blob) => {
                resolve(blob !== null && blob.type === `image/${format}`);
              },
              `image/${format}`
            );
          } catch (e) {
            resolve(false);
          }
        });
      };

      const webpSupported = await checkFormat('webp');
      const avifSupported = await checkFormat('avif');
      setSupportedFormats({ webp: webpSupported, avif: avifSupported });
    };

    checkSupport();
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSizeBefore(file.size);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setSizeAfter(0);
    setWasFallbackUsed(false);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
      URL.revokeObjectURL(img.src);
    };
  };

  // Run conversion pipeline automatically on options modify
  useEffect(() => {
    if (!selectedFile) return;

    let active = true;
    const runConversion = async () => {
      setIsProcessing(true);
      setWasFallbackUsed(false);

      try {
        const result = await convertImage(selectedFile, targetFormat, quality);
        if (!active) return;

        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(result.url);
        setSizeAfter(result.blob.size);
        setActualFormatUsed(result.blob.type);

        const expectedMime = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;
        if (result.blob.type !== expectedMime) {
          setWasFallbackUsed(true);
        }
      } catch (err) {
        console.error('Conversion error:', err);
      } finally {
        if (active) setIsProcessing(false);
      }
    };

    // Debounce conversion slightly to make slider scrolling smooth
    const timer = setTimeout(() => {
      runConversion();
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedFile, targetFormat, quality]);

  const convertImage = (file: File, format: string, qualityVal: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          // Render image onto canvas
          ctx.drawImage(img, 0, 0);

          let mimeType = 'image/jpeg';
          if (format === 'png') mimeType = 'image/png';
          else if (format === 'webp') mimeType = 'image/webp';
          else if (format === 'avif') mimeType = 'image/avif';

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  blob,
                  url: URL.createObjectURL(blob),
                });
              } else {
                reject(new Error('Blob compilation empty'));
              }
            },
            mimeType,
            format === 'png' ? undefined : qualityVal / 100
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setSizeBefore(0);
    setSizeAfter(0);
    setOriginalDims(null);
    setWasFallbackUsed(false);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const triggerDownload = () => {
    if (!resultUrl || !selectedFile) return;

    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const finalName = `${baseName}_converted.${ext}`;

    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Dynamic celebration effect
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8b5cf6', '#06b6d4', '#ec4899'],
    });
  };

  const hasQualitySlider = targetFormat !== 'png';

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-gray-100 font-sans selection:bg-brand-primary/30 selection:text-white">
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
                label="Tap to upload image to convert"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full animate-fade-in">
              
              {/* Special Instructions Guidelines */}
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

              {/* Browser Capabilities Warning banner */}
              {wasFallbackUsed && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs font-light text-gray-300">
                    <span className="font-bold text-amber-400 block mb-0.5 uppercase tracking-wide text-[10px]">Browser Limitation</span>
                    Your browser does not support exporting directly to <span className="font-bold text-white">{targetFormat.toUpperCase()}</span>.
                    The system automatically fell back to <span className="font-bold text-white">{actualFormatUsed.split('/')[1].toUpperCase()}</span> to save your image.
                  </div>
                </div>
              )}

              {/* Compare Preview */}
              <div className="w-full">
                {resultUrl && previewUrl && !isProcessing ? (
                  <CompareSlider
                    original={previewUrl}
                    modified={resultUrl}
                    height="h-[300px] sm:h-[400px]"
                  />
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px] glass-panel rounded-3xl border border-white/10 flex items-center justify-center bg-black/10">
                    <div className="flex flex-col items-center gap-2.5">
                      <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Converting Image...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-5">
                
                {/* Target Format Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                    Convert To Format
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['png', 'jpeg', 'webp', 'avif'] as const).map((format) => {
                      const isWebpCheck = format === 'webp';
                      const isAvifCheck = format === 'avif';
                      const notSupported = (isWebpCheck && !supportedFormats.webp) || (isAvifCheck && !supportedFormats.avif);

                      return (
                        <button
                          key={format}
                          onClick={() => setTargetFormat(format)}
                          className={`relative py-3.5 rounded-xl text-xs font-extrabold border transition-all ${
                            targetFormat === format
                              ? 'border-brand-primary bg-brand-primary/10 text-white shadow-lg shadow-brand-primary/10'
                              : 'border-white/5 bg-black/25 text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className="block uppercase tracking-wider">{format === 'jpeg' ? 'jpg' : format}</span>
                          {notSupported && (
                            <span className="absolute -top-1.5 right-1.5 px-1 py-0.5 rounded bg-amber-500/20 border border-amber-500/20 text-[6px] text-amber-300 font-bold uppercase tracking-wider scale-90">
                              N/A
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quality Slider (Visible for Lossy formats only) */}
                {hasQualitySlider && (
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Compression Quality
                      </span>
                      <span className="text-sm font-extrabold text-brand-secondary">
                        {quality}%
                      </span>
                    </div>
                    <div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="1"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                      />
                      <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase pt-1 px-1">
                        <span>Low Quality (Max Compress)</span>
                        <span>High Quality (No Loss)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Diagnostics Panel */}
                <div className="grid grid-cols-2 gap-4 bg-black/25 rounded-2xl border border-white/5 p-4 text-xs font-light text-gray-400">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Original Image</span>
                    <ul className="space-y-0.5">
                      <li>Mime: <span className="text-gray-300 font-medium">{selectedFile.type || 'unknown'}</span></li>
                      <li>File Size: <span className="text-gray-300 font-medium">{formatSize(sizeBefore)}</span></li>
                      {originalDims && (
                        <li>Size: <span className="text-gray-300 font-medium">{originalDims.w} x {originalDims.h} px</span></li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-4">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Converted Output</span>
                    <ul className="space-y-0.5">
                      <li>Mime: <span className="text-brand-secondary font-medium">{actualFormatUsed || 'calculating...'}</span></li>
                      <li>File Size: <span className="text-brand-secondary font-medium">{sizeAfter > 0 ? formatSize(sizeAfter) : 'calculating...'}</span></li>
                      {originalDims && (
                        <li>Size: <span className="text-brand-secondary font-medium">{originalDims.w} x {originalDims.h} px</span></li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-3">
                  {resultUrl && !isProcessing ? (
                    <button
                      onClick={triggerDownload}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-brand-secondary/20 transition-all hover:scale-[1.01]"
                    >
                      <Download className="w-5 h-5 animate-bounce" />
                      <span>Download Converted Image</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-white/5 text-gray-500 py-4 rounded-2xl font-bold text-sm cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                      <span>Processing conversion passes...</span>
                    </button>
                  )}

                  <button
                    onClick={clearAll}
                    className="w-full py-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 font-bold hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-brand-secondary" />
                    <span>Upload New Image</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {seoSection ? seoSection : (
            <div className="border-t border-white/5 pt-10 mt-10 space-y-6 text-left">
              <h3 className="text-lg font-bold text-white">Browser-Based Image Conversion</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                ResizePixel Online handles all image conversions right inside your web browser. Your photos are never uploaded to any remote servers, ensuring 100% privacy and secure local optimization. Convert between modern web formats like WebP, AVIF, PNG, and JPEG instantly.
              </p>
            </div>
          )}

        </div>
      </main>

      <footer className="p-5 border-t border-white/5 bg-black/10 text-center text-[10px] text-gray-600 font-light">
        ResizePixel Online. Free, secure, client-side format converter.
      </footer>
    </div>
  );
}
