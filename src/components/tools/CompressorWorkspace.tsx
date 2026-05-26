'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, Download, Loader2, Sliders, Crop, CheckCircle, RefreshCw, X, ArrowLeftRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import CompareSlider from '@/components/CompareSlider';
import DropZone from '@/components/DropZone';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface CompressorWorkspaceProps {
  defaultTargetSizeKb: number;
  title: string;
  subtitle: string;
  specialInstructions?: string[];
  defaultCropRatio?: 'free' | '1:1' | '16:9' | '3:1';
  pageSuffix?: string;
}

export default function CompressorWorkspace({
  defaultTargetSizeKb,
  title,
  subtitle,
  specialInstructions,
  defaultCropRatio = 'free',
  pageSuffix = 'Optimized Image',
}: CompressorWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Custom pipeline states
  const [activeSourceBlob, setActiveSourceBlob] = useState<Blob | null>(null);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(defaultTargetSizeKb);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'compress' | 'resize'>('compress');

  // Vector Crop states
  const [fabric, setFabric] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [isCropMode, setIsCropMode] = useState<boolean>(false);
  const [cropRatio, setCropRatio] = useState<string>(defaultCropRatio);

  // Diagnostics
  const [sizeBefore, setSizeBefore] = useState<number>(0);
  const [sizeAfter, setSizeAfter] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [currentDims, setCurrentDims] = useState<{ w: number; h: number } | null>(null);

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const imageObjectRef = useRef<any>(null);
  const cropRectRef = useRef<any>(null);

  const presets = [50, 100, 200, 500] as const;

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

  // Sync default target size prop
  useEffect(() => {
    setTargetSizeKb(defaultTargetSizeKb);
  }, [defaultTargetSizeKb]);

  // Sync default crop ratio prop
  useEffect(() => {
    setCropRatio(defaultCropRatio);
  }, [defaultCropRatio]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setActiveSourceBlob(file);
    setSizeBefore(file.size);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setSizeAfter(0);
    setScalePercent(100);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
      setCurrentDims({ w: img.width, h: img.height });
      URL.revokeObjectURL(img.src);
    };
  };

  const clearAll = () => {
    setSelectedFile(null);
    setActiveSourceBlob(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setSizeBefore(0);
    setSizeAfter(0);
    setOriginalDims(null);
    setCurrentDims(null);
    setIsCropMode(false);
    setScalePercent(100);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Client-side compression engine pipeline
  const compressImage = async (sourceBlob: Blob, targetKb: number, scale: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(sourceBlob);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = async () => {
          const targetSizeBytes = targetKb * 1024;
          const userScale = scale / 100;

          // Iterative binary-search quality and scale downscaler
          let lowQuality = 10;
          let highQuality = 92;
          let bestBlob: Blob | null = null;
          let bestUrl: string | null = null;
          let algoScale = 1.0;

          // Perform multiple passes (quality search, then dimension downscale search if needed)
          for (let pass = 0; pass < 2; pass++) {
            lowQuality = 12;
            highQuality = pass === 0 ? 92 : 60;

            for (let i = 0; i < 5; i++) {
              const currentQuality = (lowQuality + highQuality) / 2;
              const canvas = document.createElement('canvas');
              
              const combinedScale = userScale * algoScale;
              const w = img.width * combinedScale;
              const h = img.height * combinedScale;
              canvas.width = w;
              canvas.height = h;

              const ctx = canvas.getContext('2d');
              if (!ctx) continue;
              ctx.drawImage(img, 0, 0, w, h);

              const outputBlob = await new Promise<Blob | null>((res) => {
                canvas.toBlob(
                  (b) => res(b),
                  'image/jpeg',
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
              algoScale = 0.75;
            }
          }

          if (!bestBlob) {
            const canvas = document.createElement('canvas');
            const forceScale = userScale * 0.4;
            canvas.width = img.width * forceScale;
            canvas.height = img.height * forceScale;
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

  const executePipeline = async () => {
    if (!activeSourceBlob) return;
    setIsProcessing(true);

    try {
      const result = await compressImage(activeSourceBlob, targetSizeKb, scalePercent);
      setResultUrl(result.url);
      setSizeAfter(result.blob.size);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (activeSourceBlob && !isCropMode) {
      const timer = setTimeout(() => {
        executePipeline();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [targetSizeKb, scalePercent, activeSourceBlob, isCropMode]);

  useEffect(() => {
    if (originalDims) {
      const scale = scalePercent / 100;
      setCurrentDims({
        w: Math.round(originalDims.w * scale),
        h: Math.round(originalDims.h * scale),
      });
    }
  }, [scalePercent, originalDims]);

  // Initialize Fabric Crop Canvas
  useEffect(() => {
    if (!fabric || !isCropMode || !previewUrl || !canvasElRef.current || !cropContainerRef.current) return;

    const containerWidth = cropContainerRef.current.clientWidth || 500;
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
      let boxW = (img.width * scale) * 0.75;
      let boxH = (img.height * scale) * 0.75;

      // Apply initial ratio constraints proportionally
      if (cropRatio === '1:1') {
        const side = Math.min(boxW, boxH);
        boxW = side;
        boxH = side;
      } else if (cropRatio === '3:1') {
        boxH = boxW / 3;
      }

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
        lockUniScaling: cropRatio !== 'free',
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
  }, [fabric, isCropMode, previewUrl]);

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
      else if (ratio === '3:1') targetRatio = 3;

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
            setActiveSourceBlob(blob);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(blob));
            setOriginalDims({ w: Math.round(origCropW), h: Math.round(origCropH) });
            setIsCropMode(false);
          }
          setIsProcessing(false);
        }, 'image/jpeg', 0.95);
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
    link.download = `${pageSuffix.toLowerCase().replace(/\s+/g, '_')}_${selectedFile.name}`;
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

  // Generate SEO content dynamically based on component parameters
  const renderSEOContent = () => {
    const isPassport = title.toLowerCase().includes('passport');
    const isSignature = title.toLowerCase().includes('signature');
    const is20kb = defaultTargetSizeKb === 20;
    const is50kb = defaultTargetSizeKb === 50;
    const is100kb = defaultTargetSizeKb === 100;

    let seoTitle = `Reduce Photo File Size Online`;
    let seoGuideIntro = `Optimize your photos to match exact file size targets with high-fidelity outputs.`;
    
    let articles = [
      {
        title: "How to Reduce Your Photo File Size",
        body: "To reduce your photo file size, upload your image to VectraCompress. Our advanced compression engine will automatically analyze the pixels and use an iterative binary search to find the optimal quality level to meet your exact KB target without introducing visible blur or blocky compression artifacts."
      },
      {
        title: "Is Client-Side Compression Safe?",
        body: "Yes! Unlike other web-based resizing portals, VectraCompress operates 100% locally inside your web browser. Your private photos never leave your device, ensuring total privacy, fast compression speeds, and absolute data protection."
      }
    ];

    if (isPassport) {
      seoTitle = "Official Passport Photo Resize & Compression Guide";
      seoGuideIntro = "Learn how to prepare, crop, and compress your official identity photos to under 50KB for immediate portal acceptance.";
      articles = [
        {
          title: "How to Make Your Photo 50KB for Passports",
          body: "Official government portals require passport photos to be under 50KB and cropped in a perfect 1:1 square aspect ratio. Simply upload your photo, utilize our custom 1:1 cropping mask to align your face, and our engine will compress the resulting file to exactly 50KB without violating head-size constraints."
        },
        {
          title: "Official Passport Photo Regulations",
          body: "Ensure your passport photo has a solid white or off-white background, neutral facial expression (no smiling), eyes open and fully visible (no thick glasses), and that your head occupies between 50% to 70% of the vertical frame height before saving."
        }
      ];
    } else if (isSignature) {
      seoTitle = "Digital Signature Crop & Compression Guide";
      seoGuideIntro = "Prepare high-contrast, clean digital signature images under 20KB for employment, bank, or legal portals.";
      articles = [
        {
          title: "How to Compress Signature Image to 20KB",
          body: "Upload a clean photo of your signature written on plain white paper. Use our pre-locked 3:1 signature crop aspect ratio to frame the signature tightly. The compressor will automatically reduce your signature file size to under 20KB, preserving black ink contrast and lines."
        },
        {
          title: "Tips for Perfect Signature Uploads",
          body: "Write your signature with a black gel pen or marker on solid white paper in a well-lit room. Slicing away the surrounding page borders not only focuses on the pen strokes but drastically reduces the physical dimensions and storage footprint of your signature."
        }
      ];
    } else if (is20kb) {
      seoTitle = "How to Compress Image to 20KB Online";
      seoGuideIntro = "Learn how to reduce photo file sizes to under 20KB for rigid online portal uploads, web forms, and database storage limits.";
      articles = [
        {
          title: "Step-by-Step: Reduce Photo File Size to 20KB",
          body: "Uploading photos to old email services or government job portals often requires files under 20KB. VectraCompress accomplishes this by shrinking resolution scale and reducing JPEG quality metrics in tandem, searching through multiple compression passes to hit your exact 20KB budget."
        },
        {
          title: "Will My 20KB Image Look Pixilated?",
          body: "Compressing an image down to 20KB is a major reduction. To preserve maximum legibility, we recommend cropping away non-essential edges first, then scaling dimensions down to 50% or 60% before quality optimization. This maintains clear lines without heavy compression noise."
        }
      ];
    } else if (is50kb) {
      seoTitle = "How to Compress Image to 50KB Online";
      seoGuideIntro = "Shrink image file weights under 50KB without sacrificing critical visual shapes or introducing blurry distortions.";
      articles = [
        {
          title: "Step-by-Step: Reduce Photo File Size to 50KB",
          body: "To hit a 50KB target, simply drop your JPEG, JPG, PNG, or WebP photo into the workspace. The engine automatically targets 50KB by finding the absolute highest quality index possible that fits under the 50,000-byte mark."
        },
        {
          title: "Best Use Cases for 50KB Photos",
          body: "A 50KB weight is the golden standard limit for online applications, identity verifications, profile avatars, and fast-loading web images. It provides sufficient pixel density to display sharp features while loading instantly on slow cellular networks."
        }
      ];
    } else if (is100kb) {
      seoTitle = "How to Compress Image to 100KB Online";
      seoGuideIntro = "Maximize image fidelity while keeping file sizes strictly under 100KB for high-performance responsive web designs.";
      articles = [
        {
          title: "Step-by-Step: Reduce Photo File Size to 100KB",
          body: "Upload your high-resolution asset and keep the target preset at 100KB. Our engine will dynamically downscale unnecessary high-frequency camera noise and compress colors in the image, resulting in a lightweight 100KB copy that looks nearly identical to the original."
        },
        {
          title: "Why 100KB is Perfect for Websites",
          body: "Google prioritizes fast page loading speeds. Compressing blog headers, gallery items, and hero banners to 100KB ensures your website scores a perfect Core Web Vitals rating without forcing visitors to load multi-megabyte raw photos."
        }
      ];
    }

    return (
      <div className="border-t border-white/5 pt-10 mt-10 space-y-6 text-left">
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            {seoTitle}
          </h3>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            {seoGuideIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {articles.map((art, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
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

  const savingPercentage = sizeBefore > 0 ? Math.max(0, Math.round(((sizeBefore - sizeAfter) / sizeBefore) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 flex flex-col justify-between selection:bg-brand-primary/30 relative overflow-hidden select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Bar */}
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
            <div className="flex flex-col gap-5 w-full animate-fade-in">
              
              {/* Special Instructions Alert Banner */}
              {specialInstructions && specialInstructions.length > 0 && !isCropMode && (
                <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs leading-normal font-light text-gray-300">
                    <span className="font-bold text-white block mb-0.5 uppercase tracking-wide text-[10px]">Important Guidelines</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {specialInstructions.map((inst, index) => (
                        <li key={index}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Viewport */}
              <div className="w-full relative">
                {isCropMode ? (
                  <div
                    ref={cropContainerRef}
                    className="w-full h-[300px] sm:h-[400px] glass-panel rounded-3xl border border-white/10 flex items-center justify-center bg-black/30 relative overflow-hidden"
                  >
                    <canvas ref={canvasElRef} className="absolute inset-0" />
                    <div className="absolute right-4 bottom-4 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl text-xs text-brand-primary border border-brand-primary/20 backdrop-blur-sm z-30 font-bold uppercase tracking-wider animate-pulse">
                      <Crop className="w-3.5 h-3.5" />
                      <span>Adjust Crop box</span>
                    </div>
                  </div>
                ) : resultUrl && previewUrl ? (
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

              {/* Control panel */}
              <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-5">
                
                {!isCropMode && (
                  <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-2xl border border-white/5">
                    <button
                      onClick={() => setActiveTab('compress')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'compress' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400'
                      }`}
                    >
                      <span>⚙️ Optimize Size</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('resize')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'resize' ? 'bg-brand-secondary text-white shadow-md' : 'text-gray-400'
                      }`}
                    >
                      <span>✂️ Crop & Scale</span>
                    </button>
                  </div>
                )}

                {/* 1. COMPRESS TAB */}
                {activeTab === 'compress' && !isCropMode && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold px-1 text-gray-400">
                      <span>Original: {formatSize(sizeBefore)}</span>
                      <span className="text-brand-primary">
                        {sizeAfter > 0 ? `Compressed: ${formatSize(sizeAfter)} (-${savingPercentage}%)` : 'Optimizing...'}
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Target Size
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
                              targetSizeKb === p ? 'border-brand-primary bg-brand-primary/10 text-white shadow-lg' : 'border-white/5 bg-black/20 text-gray-400'
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
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                        />
                        <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase pt-1 px-1">
                          <span>10 KB</span>
                          <span>1.5 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CROP & SCALE TAB */}
                {activeTab === 'resize' && !isCropMode && (
                  <div className="space-y-4">
                    {currentDims && (
                      <div className="flex justify-between items-center text-xs font-semibold px-1 text-gray-400">
                        <span>Original: {originalDims?.w} x {originalDims?.h} px</span>
                        <span className="text-brand-secondary">
                          Resized: {currentDims.w} x {currentDims.h} px
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 pt-1">
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

                      <div className="pt-2">
                        <button
                          onClick={() => setIsCropMode(true)}
                          className="w-full py-3.5 rounded-2xl bg-brand-secondary/15 hover:bg-brand-secondary/30 border border-brand-secondary/20 text-brand-secondary text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Crop className="w-4 h-4" />
                          <span>✂️ Launch Interactive Cropper</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CROP WORKSPACE */}
                {isCropMode && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aspect Ratios</span>
                      <span className="text-xs font-bold text-brand-primary">Crop Selection Mode</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'free', label: 'Custom' },
                        { id: '1:1', label: '1:1 Sq' },
                        { id: '16:9', label: '16:9' },
                        { id: '3:1', label: '3:1 Wide' },
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => applyCropRatio(ratio.id)}
                          className={`py-3 rounded-xl text-xs font-bold border transition-all truncate ${
                            cropRatio === ratio.id ? 'border-brand-primary bg-brand-primary/10 text-white' : 'border-white/5 bg-black/20 text-gray-400'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleApplyCrop}
                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-2xl font-bold text-xs"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Apply Crop</span>
                      </button>
                      <button
                        onClick={() => setIsCropMode(false)}
                        className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-400 py-3.5 rounded-2xl font-bold text-xs"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Actions */}
                {!isCropMode && (
                  <div className="pt-2 flex flex-col gap-3">
                    {resultUrl ? (
                      <button
                        onClick={triggerDownload}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                      >
                        <Download className="w-5 h-5 animate-bounce" />
                        <span>Download Optimized Image</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-white/5 text-gray-500 py-4 rounded-2xl font-bold text-sm cursor-not-allowed"
                      >
                        <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                        <span>Running optimization passes...</span>
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
                )}

              </div>
            </div>
          )}

          {renderSEOContent()}

        </div>
      </main>

      <footer className="p-5 border-t border-white/5 bg-black/10 text-center text-[10px] text-gray-600 font-light">
        VectraCompress. Free, secure, client-side image optimization.
      </footer>
    </div>
  );
}
