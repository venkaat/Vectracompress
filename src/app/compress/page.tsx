'use strict';
'use client';

import React from 'react';
import Link from 'next/link';
import { Minimize2, Crop, Maximize2, Shield, Zap, Globe, Star, ChevronRight, Lock, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const tools = [
    {
      icon: <Minimize2 className="w-5 h-5 text-white" />,
      iconBg: 'bg-violet-600',
      badge: 'TARGET-KB SEARCH',
      badgeColor: 'text-violet-400 border-violet-800 bg-violet-950/60',
      title: 'Reduce by Compress',
      description: 'Shrink file weight by adjusting compression quality and target KB limits. Best for optimizing web assets, email attachments, and social media uploads without visible quality loss.',
      href: '/compress',
      keywords: ['image compression', 'reduce file size', 'compress image online', 'target KB'],
    },
    {
      icon: <Crop className="w-5 h-5 text-white" />,
      iconBg: 'bg-cyan-600',
      badge: 'SPATIAL PIXEL SLICE',
      badgeColor: 'text-cyan-400 border-cyan-800 bg-cyan-950/60',
      title: 'Reduce by Cropping',
      description: 'Slice away borders, margins, and unnecessary edges. Best for reframing subjects, removing whitespace, and deleting spatial pixel overhead from scanned documents and photos.',
      href: '/crop',
      keywords: ['crop image online', 'remove white border', 'trim image edges', 'image cropper'],
    },
    {
      icon: <Maximize2 className="w-5 h-5 text-white" />,
      iconBg: 'bg-emerald-600',
      badge: 'RESOLUTION SCALING',
      badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      title: 'Reduce by Resizing',
      description: 'Scale down pixel width, height, and overall dimension resolution proportionally. Best for optimizing large camera raw imports, print exports, and oversized digital assets.',
      href: '/resize',
      keywords: ['resize image online', 'scale down photo', 'reduce image dimensions', 'image resizer'],
    },
  ];

  const features = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: '100% Private & Secure',
      desc: 'All processing runs entirely inside your browser. Your images never leave your device — no server uploads, no data retention, zero privacy risk.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Instant Results',
      desc: 'Client-side WebAssembly engine delivers real-time compression previews and binary-search quality optimization in milliseconds.',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Works On Any Device',
      desc: 'Fully responsive image optimizer for desktop, tablet, and mobile browsers. No app download or account required.',
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Before & After Preview',
      desc: 'Interactive compare slider lets you visually inspect quality difference before downloading your optimized image file.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'No Login Required',
      desc: 'Free online image optimization with zero registration barrier. Open the tool, drop your image, and download instantly.',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'JPEG, PNG & WebP',
      desc: 'Supports all major image formats. Smart format detection auto-selects the best compression codec for maximum file size savings.',
    },
  ];

  const faqs = [
    {
      q: 'How does AuraCompress reduce image file size without losing quality?',
      a: 'AuraCompress uses a binary-search quality algorithm that iterates through JPEG quality settings to find the maximum quality level that still hits your target KB limit. For PNG files it adjusts compression levels. All processing runs client-side in your browser using the Canvas API.',
    },
    {
      q: 'Is it safe to compress images online here?',
      a: 'Yes. AuraCompress is 100% client-side. Your images are never uploaded to any server. The entire compression process happens inside your browser tab, making it as private as using desktop software.',
    },
    {
      q: 'What is the maximum image file size I can compress?',
      a: 'There is no hard server limit since everything runs locally. Practical limits depend on your device memory — most modern browsers handle files up to 30–50 MB comfortably.',
    },
    {
      q: 'Can I compress images to a specific KB size?',
      a: 'Yes, that is the core feature of the Compress tool. Set your exact target (e.g. 100 KB, 200 KB, 500 KB) and AuraCompress automatically finds the best quality setting to match that file size.',
    },
    {
      q: 'What image formats are supported?',
      a: 'AuraCompress supports JPEG, JPG, PNG, WebP, and GIF input files. Output is delivered as JPEG for photos (best compression ratio) or PNG for images requiring transparency.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 selection:bg-violet-500/30 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-emerald-500/4 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="p-5 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-violet-600 p-2 rounded-lg">
              <Minimize2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-wide">AuraCompress</span>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold leading-none mt-0.5">Ultra-Fidelity Size Reduction Suite</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 border border-emerald-800/50 bg-emerald-950/40 px-3 py-1.5 rounded-full uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            100% Secure &amp; Local
          </span>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-violet-400 border border-violet-800/50 bg-violet-950/40 px-3 py-1.5 rounded-full uppercase tracking-widest mb-8">
            <Zap className="w-3 h-3" />
            Three Unique Reduction Paths
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            How do you want to{' '}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Reduce File Size?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
            Free online image compression, cropping, and resizing tool. Reduce JPG, PNG, and WebP file sizes instantly — 
            all optimizations execute 100% client-side inside your browser cache. 
            <strong className="text-gray-300"> Instant, private, and zero login barrier.</strong>
          </p>

          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Trusted by designers, developers, and content creators to shrink image file sizes for web, email, 
            social media, and app development — without sacrificing visual quality.
          </p>
        </section>

        {/* Tool Cards */}
        <section className="px-4 pb-20 max-w-5xl mx-auto" aria-label="Image optimization tools">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${tool.iconBg} p-2.5 rounded-xl`}>
                    {tool.icon}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-1 rounded-full ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{tool.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{tool.description}</p>

                <div className="mt-5 flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                  <span>Launch Portal</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Hidden SEO keywords */}
                <ul className="sr-only" aria-hidden="true">
                  {tool.keywords.map((k) => <li key={k}>{k}</li>)}
                </ul>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Text Block — Use Cases */}
        <section className="px-4 pb-16 max-w-4xl mx-auto">
          <div className="bg-white/[0.02] border border-white/6 rounded-2xl p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              The Fast, Free Image Optimizer for Every Workflow
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              AuraCompress is a browser-based image size reducer designed for speed, privacy, and precision. 
              Whether you need to compress photos for email attachments under 1MB, optimize PNG screenshots for 
              Jira or Confluence, shrink product images for Shopify and WooCommerce, or reduce background images 
              for web performance — AuraCompress gives you exact control over the output file size in kilobytes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { stat: '100%', label: 'Client-side processing' },
                { stat: '3 Tools', label: 'Compress, crop & resize' },
                { stat: '0 KB', label: 'Data sent to servers' },
                { stat: 'Free', label: 'No account needed' },
              ].map(({ stat, label }) => (
                <div key={stat} className="text-center bg-white/[0.03] border border-white/6 rounded-xl p-4">
                  <p className="text-xl font-extrabold text-white">{stat}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="px-4 pb-16 max-w-5xl mx-auto" aria-label="Features">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Why Use AuraCompress?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 max-w-xl mx-auto">
            The most private, fast, and precise free image compression tool — built entirely in the browser.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white/[0.02] border border-white/6 rounded-xl p-5 flex gap-4">
                <div className="text-violet-400 mt-0.5 shrink-0">{f.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Case Keywords Section */}
        <section className="px-4 pb-16 max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              {
                title: 'Compress Images for Web',
                body: 'Reduce PNG and JPEG sizes to improve Google PageSpeed scores, Core Web Vitals, and LCP metrics. Target exact KB thresholds for your CDN or CMS.',
                tags: ['#web performance', '#seo images', '#page speed'],
              },
              {
                title: 'Optimize Photos for Email',
                body: 'Gmail and Outlook attachment limits made easy. Compress photos to under 500KB or 1MB for newsletters, invoices, and HR documents.',
                tags: ['#email attachments', '#photo compression', '#reduce KB'],
              },
              {
                title: 'Shrink Images for Social Media',
                body: 'Meet Instagram, Twitter, LinkedIn, and TikTok upload size requirements. Preserve quality while reducing file weight for faster uploads.',
                tags: ['#social media', '#instagram size', '#upload optimization'],
              },
            ].map((card) => (
              <div key={card.title} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{card.body}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {card.tags.map((t) => (
                    <span key={t} className="text-[10px] text-violet-400 bg-violet-950/50 border border-violet-900/40 px-2 py-0.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — rich schema-friendly */}
        <section className="px-4 pb-20 max-w-3xl mx-auto" aria-label="Frequently asked questions">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white/[0.02] border border-white/6 rounded-xl px-5 py-4 cursor-pointer"
              >
                <summary className="text-sm font-semibold text-white list-none flex items-center justify-between gap-3">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs text-gray-400 leading-relaxed mt-3 border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-24 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Start Compressing Images Free — Right Now
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            No sign-up. No file size limits. No data sent to servers. Just drop your image and download a smaller file in seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/compress"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/30"
            >
              <Minimize2 className="w-4 h-4" />
              Compress an Image
            </Link>
            <Link
              href="/crop"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
            >
              <Crop className="w-4 h-4" />
              Crop an Image
            </Link>
            <Link
              href="/resize"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              Resize an Image
            </Link>
          </div>
        </section>
      </main>

      <footer className="p-6 border-t border-white/5 bg-black/10 text-center space-y-2">
        <p className="text-[11px] text-gray-500">
          © 2026 AuraCompress · Free Online Image Compressor, Cropper &amp; Resizer · 
          Compress JPG, PNG, WebP Online · No Upload · 100% Browser-Based
        </p>
        <p className="text-[10px] text-gray-600">
          Fast, secure, client-side browser image optimization · Reduce image file size online free · 
          Target KB image compression · Privacy-first image tools
        </p>
      </footer>
    </div>
  );
}
