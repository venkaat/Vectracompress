'use strict';
'use client';

import React from 'react';
import {
  LayoutGrid,
  Maximize2,
  Minimize2,
  Sparkles,
  Scissors,
  RefreshCw,
  FileText,
  Crop,
  Layers,
} from 'lucide-react';

export type ToolTab =
  | 'dashboard'
  | 'upscaler'
  | 'compressor'
  | 'focus'
  | 'bg-remover'
  | 'converter'
  | 'pdf-tools'
  | 'crop';

interface SidebarProps {
  activeTab: ToolTab;
  setActiveTab: (tab: ToolTab) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, desc: 'Overview of all tools' },
    { id: 'upscaler', label: 'Image Upscaler', icon: Maximize2, desc: 'Increase resolution with Lanczos3' },
    { id: 'compressor', label: 'Compressor', icon: Minimize2, desc: 'Reduce file size, keep quality' },
    { id: 'focus', label: 'Blur & Sharpen', icon: Sparkles, desc: 'Interactive focus control' },
    { id: 'bg-remover', label: 'BG Remover', icon: Scissors, desc: 'Transparent backgrounds' },
    { id: 'converter', label: 'Format Converter', icon: RefreshCw, desc: 'Convert JPG, PNG, WEBP, AVIF' },
    { id: 'pdf-tools', label: 'PDF Tools', icon: FileText, desc: 'Image to PDF & PDF to Image' },
    { id: 'crop', label: 'Crop Tool', icon: Crop, desc: 'Aspect ratios & rotation' },
  ] as const;

  return (
    <aside className="w-80 flex-shrink-0 glass-panel border-r border-white/10 h-screen sticky top-0 flex flex-col justify-between overflow-y-auto">
      <div className="p-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-gradient-to-tr from-brand-primary to-brand-secondary p-2.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              AuraEdit
            </h1>
            <p className="text-[10px] text-brand-secondary font-semibold uppercase tracking-wider">
              Premium Image Suite
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/5 text-white border-l-4 border-brand-primary pl-3'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03] pl-4 border-l-4 border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-brand-primary' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                />
                <div>
                  <div className="font-medium text-sm leading-none">{item.label}</div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-none font-light group-hover:text-gray-400">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-white/5 bg-black/10">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Engine: Next.js + Sharp</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Local CPU</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
