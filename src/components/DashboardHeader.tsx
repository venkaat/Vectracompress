'use strict';
'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ToolTab } from './Sidebar';

interface DashboardHeaderProps {
  activeTab: ToolTab;
}

export default function DashboardHeader({ activeTab }: DashboardHeaderProps) {
  const getHeaderDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Welcome to AuraEdit',
          subtitle: 'Choose an image or PDF processing tool from the sidebar to get started.',
          badge: 'Fully Client & Server Powered',
        };
      case 'upscaler':
        return {
          title: 'Image Resolution Upscaler',
          subtitle: 'Enlarge your images up to 4x using advanced Lanczos3 interpolations or instant bilinear sizing.',
          badge: 'Sharp Engine Enabled',
        };
      case 'compressor':
        return {
          title: 'Smart Image Compressor',
          subtitle: 'Significantly reduce file size while maintaining pristine visual quality with lossy/lossless profiles.',
          badge: 'Pristine Optimizer',
        };
      case 'focus':
        return {
          title: 'Blur & Sharpen Studio',
          subtitle: 'Apply Gaussian defocus filters or advanced high-pass sharpening matrixes in real-time.',
          badge: 'Fabric.js Filter Studio',
        };
      case 'bg-remover':
        return {
          title: 'Background Remover Suite',
          subtitle: 'Erase backgrounds automatically with local neural networks, chroma keys, or manual touch-up brushes.',
          badge: 'WASM AI + Canvas',
        };
      case 'converter':
        return {
          title: 'Image Format Converter',
          subtitle: 'Batch convert your photos between high-efficiency formats: JPG, PNG, WEBP, AVIF, TIFF.',
          badge: 'Batch Engine',
        };
      case 'pdf-tools':
        return {
          title: 'PDF Document Toolkit',
          subtitle: 'Easily compile images into multi-page PDFs or extract high-resolution sheets from PDF pages.',
          badge: 'Bidirectional Compiler',
        };
      case 'crop':
        return {
          title: 'Precision Crop & Orient',
          subtitle: 'Crop with predefined aspect ratios, rotate by exact angles, and flip your layers horizontally or vertically.',
          badge: 'Fabric.js Vectors',
        };
      default:
        return {
          title: 'Creative Studio',
          subtitle: 'Modify your assets with professional tools.',
          badge: 'AuraEdit',
        };
    }
  };

  const { title, subtitle, badge } = getHeaderDetails();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 border-b border-white/5 bg-black/10 backdrop-blur-sm">
      <div>
        <div className="flex items-center gap-3">
          <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-white font-sans bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl font-light">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all">
          <HelpCircle className="w-4 h-4" />
          <span>Documentation</span>
        </button>
      </div>
    </header>
  );
}
