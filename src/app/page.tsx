'use strict';
'use client';

import React from 'react';
import Link from 'next/link';
import { Minimize2, Sliders, Crop, Expand, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePortal() {
  const suites = [
    {
      id: 'compress',
      title: 'Reduce by Compress',
      desc: 'Shrink file weight by adjusting compression quality and target KB limits. Best for optimizing web assets and email attachments.',
      icon: Sliders,
      href: '/compress',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-400',
      badge: 'Target-KB Search'
    },
    {
      id: 'crop',
      title: 'Reduce by Cropping',
      desc: 'Slice away borders, margins, and unnecessary edges. Best for reframing subjects and deleting spatial pixel overhead.',
      icon: Crop,
      href: '/crop',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 text-purple-400',
      badge: 'Spatial Pixel Slice'
    },
    {
      id: 'resize',
      title: 'Reduce by Resizing',
      desc: 'Scale down pixel width, height, and overall dimension resolution proportionally. Best for optimizing large camera raw imports.',
      icon: Expand,
      href: '/resize',
      color: 'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
      badge: 'Resolution Scaling'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 flex flex-col justify-between selection:bg-brand-primary/30 relative overflow-hidden select-none">
      {/* Decorative glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 border-b border-white/5 bg-black/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-brand-primary to-brand-secondary p-2.5 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.25)]">
              <Minimize2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-wide">
                AuraCompress
              </span>
              <p className="text-[9px] text-brand-secondary font-semibold uppercase tracking-wider">
                Ultra-Fidelity size reduction suite
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Secure & Local</span>
          </span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="flex-1 flex items-center py-12 px-4 sm:px-6">
        <div className="max-w-4xl w-full mx-auto space-y-12">
          
          {/* Tagline */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary">
              <Zap className="w-3.5 h-3.5 fill-brand-primary animate-pulse" />
              <span>Three Unique Reduction Paths</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              How do you want to <br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">Reduce File Size</span>?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Pick your preferred strategy below. All optimizations execute 100% client-side inside your browser cache. Instant, private, and zero login barrier.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suites.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className={`glass-panel glass-panel-hover border p-6 rounded-3xl flex flex-col justify-between h-72 bg-gradient-to-tr ${s.color} group transition-all duration-350`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5 w-fit">
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-400">
                        {s.badge}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-base text-white tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-widest gap-1 text-white opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>Launch Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/5 bg-black/15 text-center text-xs text-gray-600 font-light">
        © 2026 AuraCompress. Fast, secure client-side browser optimization.
      </footer>
    </div>
  );
}
