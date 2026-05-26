'use strict';
'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, AlertCircle } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export default function DropZone({
  onFileSelect,
  accept = 'image/*',
  maxSizeMB = 20,
  label = 'Drag and drop your image here, or click to browse',
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndSelectFile = (file: File) => {
    setError(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Validate type (basic check)
    if (accept.includes('image/*') && !file.type.startsWith('image/')) {
      // Allow pdf if specifically mentioned or if file extension is pdf
      if (accept.includes('application/pdf') && file.type === 'application/pdf') {
        // Ok
      } else {
        setError('Only image files are allowed.');
        return;
      }
    } else if (accept.includes('application/pdf') && file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError('Please upload an image or a PDF file.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 glass-panel ${
          isDragActive
            ? 'border-brand-primary bg-brand-primary/10 scale-[1.01] shadow-[0_0_25px_rgba(139,92,246,0.2)]'
            : 'border-white/10 hover:border-brand-primary/40 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
        />

        <div className={`p-4 rounded-full mb-4 transition-transform duration-500 ${
          isDragActive ? 'bg-brand-primary/20 text-brand-primary scale-110' : 'bg-white/5 text-gray-400 group-hover:scale-110'
        }`}>
          <UploadCloud className="w-10 h-10 animate-pulse" />
        </div>

        <p className="text-lg font-semibold text-center mb-1 text-gray-200">
          {label}
        </p>
        <p className="text-xs text-gray-400 text-center">
          Supports JPG, PNG, WEBP, AVIF up to {maxSizeMB}MB {accept.includes('pdf') && '& PDFs'}
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-xl text-sm border border-red-500/20">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
