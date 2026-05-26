'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Crop, Download, Loader2, CheckCircle, RefreshCw, X, ArrowLeft, Minimize2 } from 'lucide-react';
import DropZone from '@/components/DropZone';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function CropPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Vector states
  const [fabric, setFabric] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [cropRatio, setCropRatio] = useState<string>('free');

  // Diagnostics
  const [sizeBefore, setSizeBefore] = useState<number>(0);
  const [sizeAfter, setSizeAfter] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [croppedDims, setCroppedDims] = useState<{ w: number; h: number } | null>(null);

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageObjectRef = useRef<any>(null);
  const cropRectRef = useRef<any>(null);

  // Dynamic import Fabric.js client-side
  useEffect(() => {
    import('fabric').then((module) => {
      setFabric(module.fabric);
    }).catch(err => console.error("Fabric load error", err));
  }, []);

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
      setCroppedDims({ w: img.width, h: img.height });
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
    setCroppedDims(null);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Initialize Fabric Canvas on edit container
  useEffect(() => {
    if (!fabric || !previewUrl || !canvasElRef.current || !containerRef.current || resultUrl) return;

    const containerWidth = containerRef.current.clientWidth || 500;
    const containerHeight = 300;

    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: '#0c0f19',
      selection: false,
    });

    setCanvas(fabricCanvas);

    fabric.Image.fromURL(previewUrl, (img: any) => {
      imageObjectRef.current = img;

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

      // Crop Box Overlay
      const boxW = (img.width * scale) * 0.75;
      const boxH = (img.height * scale) * 0.75;

      const cropRect = new fabric.Rect({
        left: (containerWidth - boxW) / 2,
        top: (containerHeight - boxH) / 2,
        width: boxW,
        height: boxH,
        fill: 'transparent',
        stroke: '#8b5cf6',
        strokeWidth: 2,
        strokeDashArray: [6, 4],
        cornerColor: '#06b6d4',
        cornerStrokeColor: '#8b5cf6',
        cornerSize: 10,
        transparentCorners: false,
        borderColor: '#8b5cf6',
        hasRotatingPoint: false,
        lockRotation: true,
      });

      cropRectRef.current = cropRect;
      fabricCanvas.add(cropRect);
      fabricCanvas.setActiveObject(cropRect);
      fabricCanvas.renderAll();
    });

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [fabric, previewUrl, resultUrl]);

  const applyCropRatio = (ratio: string) => {
    setCropRatio(ratio);
    if (!cropRectRef.current || !canvas) return;

    const cropRect = cropRectRef.current;
    const currentW = cropRect.width * cropRect.scaleX;

    if (ratio === 'free') {
      cropRect.set({ lockUniScaling: false });
    } else {
      let targetRatio = 1;
      if (ratio === '1:1') targetRatio = 1;
      else if (ratio === '16:9') targetRatio = 16 / 9;

      cropRect.set({
        height: currentW / targetRatio,
        scaleY: 1,
        lockUniScaling: true,
      });
    }
    canvas.renderAll();
  };

  const handleApplyCrop = () => {
    if (!canvas || !imageObjectRef.current || !cropRectRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageObjectRef.current;
      const cropRect = cropRectRef.current;

      const cLeft = cropRect.left;
      const cTop = cropRect.top;
      const cW = cropRect.width * cropRect.scaleX;
      const cH = cropRect.height * cropRect.scaleY;

      const originalImg = new Image();
      originalImg.src = previewUrl!;
      originalImg.onload = () => {
        const offCanvas = document.createElement('canvas');
        const ctx = offCanvas.getContext('2d');
        if (!ctx) return;

        const fScaleX = img.scaleX;
        const fScaleY = img.scaleY;

        const centerPoint = img.getCenterPoint();
        const dx = cLeft - centerPoint.x;
        const dy = cTop - centerPoint.y;

        const origCropLeft = (dx / fScaleX) + (originalImg.width / 2);
        const origCropTop = (dy / fScaleY) + (originalImg.height / 2);
        const origCropW = cW / fScaleX;
        const origCropH = cH / fScaleY;

        offCanvas.width = origCropW;
        offCanvas.height = origCropH;

        ctx.drawImage(
          originalImg,
          origCropLeft,
          origCropTop,
          origCropW,
          origCropH,
          0,
          0,
          origCropW,
          origCropH
        );

        offCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setSizeAfter(blob.size);
            setCroppedDims({ w: Math.round(origCropW), h: Math.round(origCropH) });
          }
          setIsProcessing(false);
        }, selectedFile?.type || 'image/jpeg', 0.92);
      };
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!resultUrl || !selectedFile) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `cropped_${selectedFile.name}`;
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
              AuraCrop
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Reduce by Cropping
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
                  Crop Image Margins
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm mx-auto">
                  Drag the interactive box boundaries to slice away unnecessary pixels, reducing physical size and file weight instantly.
                </p>
              </div>

              <DropZone
                onFileSelect={handleFileSelect}
                label="Tap to upload image"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5 w-full animate-fade-in">
              
              {/* Preview Container */}
              <div ref={containerRef} className="w-full relative">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Cropped Output"
                    className="w-full h-[300px] sm:h-[400px] object-contain glass-panel rounded-3xl border border-white/10 p-4"
                  />
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px] glass-panel rounded-3xl border border-white/10 flex items-center justify-center bg-black/30 relative overflow-hidden">
                    <canvas ref={canvasElRef} className="absolute inset-0" />
                    <div className="absolute right-4 bottom-4 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl text-xs text-brand-primary border border-brand-primary/20 backdrop-blur-sm z-30 font-bold uppercase tracking-wider animate-pulse">
                      <Crop className="w-3.5 h-3.5" />
                      <span>Adjust Crop box</span>
                    </div>
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
                  {resultUrl && croppedDims && (
                    <span className="text-brand-primary font-bold">
                      Cropped: {croppedDims.w} x {croppedDims.h} px ({formatSize(sizeAfter)})
                    </span>
                  )}
                </div>

                {/* Aspect presets */}
                {!resultUrl && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aspect Ratios</span>
                      <span className="text-xs font-bold text-brand-primary">Crop Selection Mode</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'free', label: 'Custom' },
                        { id: '1:1', label: '1:1 Square' },
                        { id: '16:9', label: '16:9 Cinema' },
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => applyCropRatio(ratio.id)}
                          className={`py-3.5 rounded-xl text-xs font-bold border transition-all truncate ${
                            cropRatio === ratio.id ? 'border-brand-primary bg-brand-primary/10 text-white' : 'border-white/5 bg-black/20 text-gray-400'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-3">
                  {resultUrl ? (
                    <>
                      <button
                        onClick={triggerDownload}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:opacity-95 transition-all"
                      >
                        <Download className="w-5 h-5 animate-bounce" />
                        <span>Download Cropped Image</span>
                      </button>
                      <button
                        onClick={() => {
                          setResultUrl(null);
                          setSizeAfter(0);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 font-bold hover:text-white transition-all"
                      >
                        <span>Recrop Selection</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleApplyCrop}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Slicing Canvas...</span>
                        </>
                      ) : (
                        <>
                          <Crop className="w-5 h-5" />
                          <span>Apply Crop Selection</span>
                        </>
                      )}
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

          {/* Detailed SEO Copywriting Guide Section */}
          <div className="border-t border-white/5 pt-10 mt-10 space-y-6 text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Interactive Guide: How to Crop Your Image Online
              </h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Learn how to slice away borders, adjust aspect ratios, and crop your image to highlight your subject.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
                  Why Crop Your Image?
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Cropping your image does more than just reframe a portrait. By cutting out blank outer margins, unwanted background distractors, or wide borders, you are physically discarding thousands of unnecessary pixels. This spatial pruning is a highly effective way to reduce the overall file weight and dimensions of your image without compressing quality.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
                  Understanding Aspect Ratio Presets
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Different online portals require unique spatial formats. A perfect 1:1 Square aspect ratio is standard for passport photos, social media profiles, and company avatar icons. A 16:9 widescreen ratio is optimized for hero banners, web slides, and landscape desktop backgrounds. Use our pre-locked aspect ratio boundaries to crop with absolute geometric precision.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="p-5 border-t border-white/5 bg-black/10 text-center text-[10px] text-gray-600 font-light">
        VectraCompress. Free, secure, client-side image optimization.
      </footer>
    </div>
  );
}
