'use strict';
'use client';

import React, { useState } from 'react';
import { RefreshCw, Download, FileImage, Trash2, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import DropZone from '../DropZone';
import confetti from 'canvas-confetti';

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'converting' | 'success' | 'error';
  convertedUrl?: string;
  convertedName?: string;
  errorMsg?: string;
  targetFormat: string;
  sizeBefore: string;
  sizeAfter?: string;
}

export default function Converter() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [globalFormat, setGlobalFormat] = useState<string>('webp');
  const [globalQuality, setGlobalQuality] = useState<number>(85);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newFile: QueuedFile = {
      id,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'idle',
      targetFormat: globalFormat,
      sizeBefore: formatSize(file.size),
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
        if (fileToRemove.convertedUrl) URL.revokeObjectURL(fileToRemove.convertedUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const updateFileFormat = (id: string, format: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: format } : f))
    );
  };

  const convertSingleFile = async (queuedFile: QueuedFile): Promise<QueuedFile> => {
    setFiles((prev) =>
      prev.map((f) => (f.id === queuedFile.id ? { ...f, status: 'converting' } : f))
    );

    try {
      const formData = new FormData();
      formData.append('file', queuedFile.file);
      formData.append('format', queuedFile.targetFormat);
      formData.append('quality', globalQuality.toString());

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to convert');
      }

      const blob = await res.blob();
      const convertedUrl = URL.createObjectURL(blob);
      const convertedName = `${queuedFile.file.name.substring(
        0,
        queuedFile.file.name.lastIndexOf('.')
      )}.${queuedFile.targetFormat === 'jpeg' ? 'jpg' : queuedFile.targetFormat}`;

      return {
        ...queuedFile,
        status: 'success',
        convertedUrl,
        convertedName,
        sizeAfter: formatSize(blob.size),
      };
    } catch (err: any) {
      return {
        ...queuedFile,
        status: 'error',
        errorMsg: err.message || 'Error converting file',
      };
    }
  };

  const processAllFiles = async () => {
    if (files.length === 0 || isProcessingAll) return;
    setIsProcessingAll(true);

    const updatedFiles = [...files];
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'success') continue;
      const result = await convertSingleFile(updatedFiles[i]);
      updatedFiles[i] = result;
      setFiles([...updatedFiles]);
    }

    setIsProcessingAll(false);

    // Trigger celebration if everything succeeded
    if (updatedFiles.every((f) => f.status === 'success')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#ec4899'],
      });
    }
  };

  const downloadAll = () => {
    files.forEach((f) => {
      if (f.convertedUrl && f.convertedName) {
        const link = document.createElement('a');
        link.href = f.convertedUrl;
        link.download = f.convertedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Upload Dropzone */}
      <DropZone
        onFileSelect={handleFileSelect}
        label="Drag and drop photos for batch conversion"
      />

      {files.length > 0 && (
        <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-6">
          {/* Global Parameters */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                  Global Format
                </label>
                <div className="flex gap-2">
                  {['png', 'jpeg', 'webp', 'avif', 'tiff'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setGlobalFormat(fmt);
                        setFiles((prev) => prev.map((f) => ({ ...f, targetFormat: fmt })));
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                        globalFormat === fmt
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {fmt === 'jpeg' ? 'jpg' : fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                    Quality Preset
                  </label>
                  <span className="text-xs font-bold text-brand-secondary">{globalQuality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={globalQuality}
                  onChange={(e) => setGlobalQuality(parseInt(e.target.value))}
                  className="w-48 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={processAllFiles}
                disabled={isProcessingAll}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isProcessingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    <span>Convert All Files</span>
                  </>
                )}
              </button>

              {files.some((f) => f.status === 'success') && (
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              )}
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-3">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
                    <img
                      src={f.previewUrl}
                      alt={f.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 max-w-[200px] sm:max-w-[300px]">
                    <h4 className="text-sm font-semibold text-white truncate leading-none">
                      {f.file.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{f.sizeBefore}</span>
                      {f.sizeAfter && (
                        <>
                          <ArrowRight className="w-3 h-3 text-gray-500" />
                          <span className="text-brand-secondary font-semibold">{f.sizeAfter}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  {/* Select Format for Single File */}
                  {f.status === 'idle' && (
                    <select
                      value={f.targetFormat}
                      onChange={(e) => updateFileFormat(f.id, e.target.value)}
                      className="glass-input text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-dark-bg focus:border-brand-primary"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPG</option>
                      <option value="webp">WEBP</option>
                      <option value="avif">AVIF</option>
                      <option value="tiff">TIFF</option>
                    </select>
                  )}

                  {/* Status Indicator / Actions */}
                  <div className="flex items-center gap-3">
                    {f.status === 'converting' && (
                      <span className="flex items-center gap-1.5 text-xs text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Converting</span>
                      </span>
                    )}

                    {f.status === 'success' && (
                      <>
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready</span>
                        </span>
                        {f.convertedUrl && f.convertedName && (
                          <a
                            href={f.convertedUrl}
                            download={f.convertedName}
                            className="p-2 rounded-lg bg-brand-secondary/15 hover:bg-brand-secondary/30 text-brand-secondary transition-all"
                            title="Download Converted Image"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </>
                    )}

                    {f.status === 'error' && (
                      <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg font-semibold">
                        {f.errorMsg || 'Failed'}
                      </span>
                    )}

                    <button
                      onClick={() => removeFile(f.id)}
                      disabled={f.status === 'converting' || isProcessingAll}
                      className="p-2 rounded-lg hover:bg-red-500/15 text-gray-500 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
