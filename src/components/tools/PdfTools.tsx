'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, FileImage, Download, RefreshCw, Loader2, Sparkles, Plus, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PDFImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function PdfTools() {
  const [activeSubMode, setActiveSubMode] = useState<'imgToPdf' | 'pdfToImg'>('imgToPdf');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Image to PDF States
  const [imgItems, setImgItems] = useState<PDFImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('fit');
  
  // 2. PDF to Image States
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [pdfPagesCount, setPdfPagesCount] = useState<number>(0);
  const [pdfPagesPreviews, setPdfPagesPreviews] = useState<string[]>([]);
  const [pdfLibLoaded, setPdfLibLoaded] = useState<any>(null);
  const [pdfjsLoaded, setPdfjsLoaded] = useState<any>(null);

  // Dynamically load PDF libraries
  useEffect(() => {
    // 1. Load pdf-lib
    import('pdf-lib').then((module) => {
      setPdfLibLoaded(() => module);
    }).catch(err => console.error("pdf-lib loading failed", err));

    // 2. Load pdfjs-dist
    import('pdfjs-dist').then((module) => {
      // Set worker path automatically
      module.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${module.version}/pdf.worker.min.js`;
      setPdfjsLoaded(() => module);
    }).catch(err => console.error("pdfjs-dist loading failed", err));
  }, []);

  useEffect(() => {
    return () => {
      imgItems.forEach((i) => URL.revokeObjectURL(i.previewUrl));
      pdfPagesPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imgItems, pdfPagesPreviews]);

  // Image to PDF Actions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems: PDFImageItem[] = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImgItems((prev) => [...prev, ...newItems]);
    }
  };

  const removeImageItem = (id: string) => {
    setImgItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= imgItems.length) return;

    const updated = [...imgItems];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setImgItems(updated);
  };

  const compileToPdf = async () => {
    if (imgItems.length === 0 || !pdfLibLoaded) return;
    setIsProcessing(true);

    try {
      const { PDFDocument } = pdfLibLoaded;
      const pdfDoc = await PDFDocument.create();

      for (const item of imgItems) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;
        
        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Fallback to jpeg embed
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        let width = embeddedImage.width;
        let height = embeddedImage.height;

        if (pageSize === 'a4') {
          // A4 dimensions: 595.27 x 841.89 points
          width = 595.27;
          height = 841.89;
        } else if (pageSize === 'letter') {
          // Letter dimensions: 612 x 792 points
          width = 612;
          height = 792;
        }

        const page = pdfDoc.addPage([width, height]);
        
        // Resize embedded image to fit target page perfectly
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `auraedit_compiled_${Date.now()}.pdf`;
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
      console.error(err);
      alert('PDF compilation failed. Make sure your uploaded images are valid PNGs or JPEGs.');
    } finally {
      setIsProcessing(false);
    }
  };

  // PDF to Image Actions
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && pdfjsLoaded) {
      const file = e.target.files[0];
      setSelectedPdf(file);
      setIsProcessing(true);
      setPdfPagesPreviews([]);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);

        const pdf = await pdfjsLoaded.getDocument({ data: pdfData }).promise;
        setPdfPagesCount(pdf.numPages);

        const previews: string[] = [];

        // Render first few pages as preview cards (limit to first 10 for performance)
        const pagesToRender = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= pagesToRender; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                previews.push(url);
                if (previews.length === pagesToRender) {
                  setPdfPagesPreviews([...previews]);
                }
              }
            }, 'image/png');
          }
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load PDF pages. Check file integrity.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleExtractPages = async () => {
    if (!selectedPdf || !pdfjsLoaded) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedPdf.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLoaded.getDocument({ data: pdfData }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // high res scale

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          
          // Download page sequentially
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `page_${i}_${selectedPdf.name.substring(0, selectedPdf.name.lastIndexOf('.'))}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
              resolve();
            }, 'image/png');
          });
        }
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#ec4899'],
      });
    } catch (err) {
      console.error(err);
      alert('Extraction failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Submode Switcher */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-2xl border border-white/5 w-80 max-w-full">
          <button
            onClick={() => setActiveSubMode('imgToPdf')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeSubMode === 'imgToPdf'
                ? 'bg-brand-primary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Image to PDF</span>
          </button>
          <button
            onClick={() => setActiveSubMode('pdfToImg')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeSubMode === 'pdfToImg'
                ? 'bg-brand-secondary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>PDF to Image</span>
          </button>
        </div>
      </div>

      {activeSubMode === 'imgToPdf' ? (
        // IMAGE TO PDF UTILITY
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-primary" />
                  <span>PDF Settings</span>
                </h3>
                <button
                  onClick={() => setImgItems([])}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  Clear Queue
                </button>
              </div>

              {/* Page Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Page Dimensions
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'fit', label: 'Match Original Image Size' },
                    { id: 'a4', label: 'A4 Portrait Size' },
                    { id: 'letter', label: 'US Letter Portrait Size' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setPageSize(size.id as 'fit' | 'a4' | 'letter')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        pageSize === size.id
                          ? 'border-brand-primary bg-brand-primary/5 text-white'
                          : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-semibold">{size.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal font-light">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                  Page Compilation Order
                </div>
                Upload your images and arrange their layout. Use the up and down arrows in the workspace list to order the PDF sheets from first to last.
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={compileToPdf}
                disabled={isProcessing || imgItems.length === 0 || !pdfLibLoaded}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Compiling PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Compile PDF ({imgItems.length} Sheets)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                PDF Pages Pipeline
              </h3>

              <label className="flex items-center gap-1.5 bg-brand-primary/20 hover:bg-brand-primary/30 border border-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Page Sheets</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {imgItems.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-[480px] p-2 border border-white/5 bg-black/10 rounded-2xl">
                {imgItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-white/5 bg-black/20 hover:border-white/10 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-500 w-6 text-center">
                        #{index + 1}
                      </span>
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">
                        {item.file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-20"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === imgItems.length - 1}
                        className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-20"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeImageItem(item.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[380px] glass-panel rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center select-none bg-black/10">
                <FileImage className="w-12 h-12 text-gray-500 mb-3 animate-pulse" />
                <h4 className="font-semibold text-gray-300">Queue is empty</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1 font-light leading-normal">
                  Upload multiple image layouts using the "Add Page Sheets" button to assemble them into a custom PDF document.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // PDF TO IMAGE UTILITY
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-brand-secondary" />
                  <span>Image Extractor</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedPdf(null);
                    setPdfPagesPreviews([]);
                    setPdfPagesCount(0);
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  Clear
                </button>
              </div>

              {selectedPdf && (
                <div className="border border-white/5 bg-black/20 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Document Name:</span>
                    <span className="text-gray-200 font-bold truncate max-w-[150px]">{selectedPdf.name}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-white/5 pt-2 mt-2">
                    <span className="text-gray-400 font-medium">Total Page Count:</span>
                    <span className="text-brand-secondary font-extrabold">{pdfPagesCount} Pages</span>
                  </div>
                </div>
              )}

              <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal font-light">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-brand-secondary" />
                  Extract page renders
                </div>
                Generates high-definition, double-density PNG graphics of each page in the document. Page sheet downloads trigger sequentially in your browser.
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={handleExtractPages}
                disabled={isProcessing || !selectedPdf || !pdfjsLoaded}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Extracting Sheets...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Extract {pdfPagesCount} Pages</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              PDF Pages Preview Deck
            </h3>

            {!selectedPdf ? (
              <div className="w-full h-[380px] glass-panel rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center select-none bg-black/10">
                <FileText className="w-12 h-12 text-gray-500 mb-3 animate-pulse" />
                <h4 className="font-semibold text-gray-300">No PDF uploaded</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1 font-light leading-normal mb-6">
                  Select a multi-page PDF document to render its pages and export them as standalone, high-res PNG images.
                </p>

                <label className="flex items-center gap-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:opacity-90 shadow-lg shadow-brand-primary/25 transition-all">
                  <Plus className="w-4 h-4" />
                  <span>Choose PDF Document</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePdfUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] p-2 border border-white/5 bg-black/10 rounded-2xl">
                {pdfPagesPreviews.map((url, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 border border-white/5 bg-black/30 p-2.5 rounded-xl hover:border-white/10 transition-all group"
                  >
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-white">
                      <img src={url} alt={`Page ${index + 1}`} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Page {index + 1}
                    </span>
                  </div>
                ))}
                {isProcessing && pdfPagesPreviews.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
                    <span className="text-xs text-gray-500 font-light">Rendering document sheets...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
