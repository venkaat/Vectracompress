'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Crop, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import DropZone from '../DropZone';
import confetti from 'canvas-confetti';

export default function CropTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fabric, setFabric] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('free'); // 'free', '1:1', '16:9', '4:3', '3:2'
  const [rotation, setRotation] = useState<number>(0);
  const [flipX, setFlipX] = useState<boolean>(false);
  const [flipY, setFlipY] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isFabricLoading, setIsFabricLoading] = useState(true);

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageObjectRef = useRef<any>(null);
  const cropRectRef = useRef<any>(null);

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
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  // Initialize Fabric Canvas once image is selected and fabric is loaded
  useEffect(() => {
    if (!fabric || !previewUrl || !canvasElRef.current || !containerRef.current) return;

    // Get container dimensions
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

      // Scale image to fit inside canvas
      const scaleX = (containerWidth - 60) / img.width;
      const scaleY = (containerHeight - 60) / img.height;
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

      // Create interactive Crop Selection Overlay Rectangle
      const rectWidth = (img.width * scale) * 0.7;
      const rectHeight = (img.height * scale) * 0.7;

      const cropRect = new fabric.Rect({
        left: (containerWidth - rectWidth) / 2,
        top: (containerHeight - rectHeight) / 2,
        width: rectWidth,
        height: rectHeight,
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
  }, [fabric, previewUrl]);

  // Adjust crop aspect ratio dynamically
  const applyAspectRatio = (ratio: string) => {
    setAspectRatio(ratio);
    if (!cropRectRef.current || !canvas) return;

    const cropRect = cropRectRef.current;
    const currentWidth = cropRect.width * cropRect.scaleX;

    if (ratio === 'free') {
      cropRect.set({
        lockUniScaling: false,
      });
    } else {
      let targetRatio = 1;
      if (ratio === '1:1') targetRatio = 1;
      else if (ratio === '16:9') targetRatio = 16 / 9;
      else if (ratio === '4:3') targetRatio = 4 / 3;
      else if (ratio === '3:2') targetRatio = 3 / 2;

      cropRect.set({
        height: currentWidth / targetRatio,
        scaleY: 1,
        lockUniScaling: true,
      });
    }
    canvas.renderAll();
  };

  // Rotation
  const rotate = (angleOffset: number) => {
    if (!canvas || !imageObjectRef.current) return;
    const img = imageObjectRef.current;
    const nextRotation = (rotation + angleOffset) % 360;
    setRotation(nextRotation);

    img.set({
      angle: nextRotation,
    });
    canvas.renderAll();
  };

  // Flip Horizontal
  const handleFlipH = () => {
    if (!canvas || !imageObjectRef.current) return;
    const img = imageObjectRef.current;
    const nextFlipX = !flipX;
    setFlipX(nextFlipX);
    img.set({
      flipX: nextFlipX,
    });
    canvas.renderAll();
  };

  // Flip Vertical
  const handleFlipV = () => {
    if (!canvas || !imageObjectRef.current) return;
    const img = imageObjectRef.current;
    const nextFlipY = !flipY;
    setFlipY(nextFlipY);
    img.set({
      flipY: nextFlipY,
    });
    canvas.renderAll();
  };

  // Execute Crop operation on Canvas coordinates
  const handleCrop = () => {
    if (!canvas || !imageObjectRef.current || !cropRectRef.current || !selectedFile) return;
    setIsProcessing(true);

    try {
      const img = imageObjectRef.current;
      const cropRect = cropRectRef.current;

      // Extract crop dimensions in canvas coordinates
      const cropLeft = cropRect.left;
      const cropTop = cropRect.top;
      const cropWidth = cropRect.width * cropRect.scaleX;
      const cropHeight = cropRect.height * cropRect.scaleY;

      // Create an offscreen canvas to render original image transformation & crop
      const originalImage = new Image();
      originalImage.src = previewUrl!;
      originalImage.onload = () => {
        const offscreenCanvas = document.createElement('canvas');
        const ctx = offscreenCanvas.getContext('2d');
        if (!ctx) return;

        // Determine image relative scaling inside Fabric
        const fabricScaleX = img.scaleX;
        const fabricScaleY = img.scaleY;

        // Calculate crop bounds relative to the rotated/scaled image object center
        // To simplify, we get exact coordinates using fabric's target object matrix.
        const centerPoint = img.getCenterPoint();
        
        // Calculate offset from image center to crop top-left
        const dx = cropLeft - centerPoint.x;
        const dy = cropTop - centerPoint.y;

        // Rotate the offset back to unrotated space
        const angleRad = -img.angle * (Math.PI / 180);
        const rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
        const ry = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

        // Map to original pixels
        const origCropLeft = (rx / fabricScaleX) + (originalImage.width / 2);
        const origCropTop = (ry / fabricScaleY) + (originalImage.height / 2);
        const origCropWidth = cropWidth / fabricScaleX;
        const origCropHeight = cropHeight / fabricScaleY;

        // Setup offscreen canvas
        offscreenCanvas.width = origCropWidth;
        offscreenCanvas.height = origCropHeight;

        // Move context to center to apply rotation & flips
        ctx.translate(origCropWidth / 2, origCropHeight / 2);

        if (flipX) ctx.scale(-1, 1);
        if (flipY) ctx.scale(1, -1);
        ctx.rotate(img.angle * (Math.PI / 180));

        // Draw original image with crop calculations
        ctx.drawImage(
          originalImage,
          origCropLeft,
          origCropTop,
          origCropWidth,
          origCropHeight,
          -origCropWidth / 2,
          -origCropHeight / 2,
          origCropWidth,
          origCropHeight
        );

        offscreenCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResultUrl(url);

            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#8b5cf6', '#06b6d4'],
            });
          }
          setIsProcessing(false);
        }, selectedFile.type || 'image/jpeg', 0.95);
      };
    } catch (error) {
      console.error("Cropping failed:", error);
      setIsProcessing(false);
    }
  };

  const clearResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {!selectedFile ? (
        <DropZone
          onFileSelect={handleFileSelect}
          label="Upload an image to crop, rotate and align"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Crop className="w-5 h-5 text-brand-primary" />
                  <span>Crop & Orientation</span>
                </h3>
                <button
                  onClick={() => {
                    clearResult();
                    setSelectedFile(null);
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  New Image
                </button>
              </div>

              {/* Aspect Ratio Presets */}
              {!resultUrl && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'free', label: 'Custom' },
                      { id: '1:1', label: '1:1 Square' },
                      { id: '16:9', label: '16:9 Cinema' },
                      { id: '4:3', label: '4:3 Standard' },
                      { id: '3:2', label: '3:2 Classic' },
                    ].map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => applyAspectRatio(ratio.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all truncate ${
                          aspectRatio === ratio.id
                            ? 'border-brand-primary bg-brand-primary/10 text-white'
                            : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Transform Operations */}
              {!resultUrl && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Rotate & Flip
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => rotate(-90)}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white transition-all"
                      title="Rotate Left"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-[9px] uppercase font-bold">L 90°</span>
                    </button>
                    <button
                      onClick={() => rotate(90)}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white transition-all"
                      title="Rotate Right"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span className="text-[9px] uppercase font-bold">R 90°</span>
                    </button>
                    <button
                      onClick={handleFlipH}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all ${
                        flipX
                          ? 'border-brand-secondary bg-brand-secondary/15 text-brand-secondary'
                          : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                      title="Flip Horizontal"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span className="text-[9px] uppercase font-bold">Flip H</span>
                    </button>
                    <button
                      onClick={handleFlipV}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all ${
                        flipY
                          ? 'border-brand-secondary bg-brand-secondary/15 text-brand-secondary'
                          : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                      title="Flip Vertical"
                    >
                      <FlipVertical className="w-4 h-4" />
                      <span className="text-[9px] uppercase font-bold">Flip V</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {!resultUrl && (
                <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal font-light">
                  <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                    Interactive Crop Overlay
                  </div>
                  Resize the dotted rectangle inside the workspace viewport. Drag it from the corners or edges to target the exact crop area.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              {resultUrl ? (
                <>
                  <a
                    href={resultUrl}
                    download={`cropped_${selectedFile.name}`}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Cropped Image</span>
                  </a>
                  <button
                    onClick={clearResult}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Recrop Image</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCrop}
                  disabled={isProcessing || isFabricLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Slicing Canvas...</span>
                    </>
                  ) : (
                    <>
                      <Crop className="w-5 h-5" />
                      <span>Crop Selection</span>
                    </>
                  )}
                </button>
              )}
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
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Cropped Output"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <>
                  {isFabricLoading && (
                    <div className="absolute inset-0 bg-[#0c0f19] flex items-center justify-center z-15">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                        <span className="text-xs text-gray-500 font-light">Loading Vector Canvas...</span>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasElRef} className="absolute inset-0" />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
