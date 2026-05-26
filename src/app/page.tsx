'use strict';
'use client';

import React from 'react';
import Link from 'next/link';
import { Minimize2, Sliders, Crop, Expand, Zap, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';

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
                VectraCompress
              </span>
              <p className="text-[9px] text-brand-secondary font-semibold uppercase tracking-wider">
                Reduce Image size without losing quality
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Images Never Leave Your Device</span>
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
              Compress Images Without <br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">Losing Quality</span>?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Compress, resize, or crop images instantly in your browser. 
Fast, private, and free image optimization with no upload limits.
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

          {/* Specialized Tools Quick Links Section */}
          <div className="space-y-4 pt-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
              Specialized Formatting Utilities
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: "Compress image to 20KB", href: "/compress-image-to-20kb" },
                { name: "Compress image to 50KB", href: "/compress-image-to-50kb" },
                { name: "Compress image to 100KB", href: "/compress-image-to-100kb" },
                { name: "Passport Photo Reducer", href: "/passport-photo-size-reducer" },
                { name: "Signature Compressor", href: "/signature-image-compressor" },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="px-4 py-2 text-xs font-semibold bg-white/[0.02] border border-white/5 hover:border-brand-primary/30 rounded-full text-gray-400 hover:text-white transition-all hover:scale-[1.02]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Detailed SEO Copywriting Guide Section */}
          <div className="border-t border-white/5 pt-12 space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Complete Guide to Image Size Reduction
              </h3>
              <p className="text-xs text-gray-400 font-light max-w-xl mx-auto">
                Optimize your digital footprint. Learn how to reduce your photo file size, crop unnecessary margins, and resize dimensions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3 bg-white/[0.01]">
                <div className="text-brand-primary text-xs font-bold uppercase tracking-widest">
                  1. Reduce Photo File Size
                </div>
                <h4 className="font-bold text-white text-sm">Target KB Compression</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Adjusting quality compression is the fastest way to shrink an image's storage footprint. VectraCompress uses advanced client-side binary search algorithms to iteratively compress images down to specific size targets like 20KB, 50KB, or 100KB, finding the perfect balance between size and high visual fidelity.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3 bg-white/[0.01]">
                <div className="text-brand-accent text-xs font-bold uppercase tracking-widest">
                  2. Crop Your Image
                </div>
                <h4 className="font-bold text-white text-sm">Spatial Trimming</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Often, large image sizes are caused by unnecessary blank spaces or unwanted border details. Slicing away border margins physically deletes raw pixels from your canvas, reducing both dimensional scale and file weight without degrading the remaining details. Perfect for framing subjects.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3 bg-white/[0.01]">
                <div className="text-brand-secondary text-xs font-bold uppercase tracking-widest">
                  3. Resize Dimensions
                </div>
                <h4 className="font-bold text-white text-sm">Resolution Downscaling</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Large megapixel camera imports can choke websites and online portals. By scaling down the width and height proportionally (e.g., to 50% or 75% scale), you compress overall pixel resolution using smooth bilinear interpolation, producing beautifully crisp, fast-loading images optimized for the web.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive FAQ Section */}
          <div className="border-t border-white/5 pt-12 pb-6 space-y-6">
            <h3 className="text-xl font-extrabold text-center text-white tracking-tight">
              Frequently Asked Questions
            </h3>
            
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  q: "How do I reduce my photo file size to exactly 20KB or 50KB?",
                  a: "Use our specialized target compressors! Simply upload your image, select the target size (e.g. 20KB or 50KB), and VectraCompress will automatically search for the optimal compression quality and size configuration to match your limit."
                },
                {
                  q: "Does VectraCompress upload my private photos to any servers?",
                  a: "No! VectraCompress is built 100% on client-side browser cache. Your photos are optimized directly inside your browser and never leave your device. We stand for complete data security and total privacy."
                },
                {
                  q: "What is the difference between cropping and resizing an image?",
                  a: "Cropping cuts out unwanted outer edges of the photo to refocus the subject (changing the aspect ratio). Resizing downscales the entire image's physical width and height proportionally, keeping the full picture but reducing raw pixels."
                },
                {
                  q: "Which image formats are supported for compression?",
                  a: "We support major formats including JPEG, JPG, PNG, and WebP. All optimized outputs are cleanly wrapped in optimized formats for immediate download."
                }
              ].map((faq, index) => (
                <details key={index} className="group glass-panel rounded-2xl border border-white/5 bg-white/[0.01] p-5 cursor-pointer select-none">
                  <summary className="list-none flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mt-4 pt-4 border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/5 bg-black/15 text-center text-xs text-gray-600 font-light">
        © 2026 VectraCompress. Fast, secure client-side Image size Reducer.
      </footer>
    </div>
  );
}
