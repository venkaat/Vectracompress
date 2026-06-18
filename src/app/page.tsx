import React from 'react';
import Link from 'next/link';
import type { Metadata } from "next";
import { Minimize2, Sliders, Crop, Expand, Zap, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: "Resize Image Online Free | Compress, Crop & Convert Images - ResizePixel Online",
  description: "Resize, compress, crop, and convert images online for free. Change image size in pixels, KB, or MB instantly. No signup required. Fast, secure, and easy to use.",
  keywords: [
    "resize image online",
    "image resizer",
    "compress image online",
    "reduce image size in kb",
    "resize image in pixels",
    "passport photo resize",
    "signature resize tool",
    "image compressor",
    "convert jpg to png",
    "resize image without losing quality"
  ],
  openGraph: {
    title: "ResizePixel Online - Free Image Resizer & Compressor",
    description: "Resize, compress, crop, and convert images instantly. Free online image tools with no registration required.",
    type: "website"
  }
};

export default function HomePortal() {
  const suites = [
    {
      id: 'compress',
      title: 'Compress Image',
      desc: 'Shrink file weight by adjusting compression quality and target KB limits. Best for optimizing web assets and email attachments.',
      icon: Sliders,
      href: '/compress-image',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-400',
      badge: 'Target-KB Search'
    },
    {
      id: 'crop',
      title: 'Crop Image',
      desc: 'Slice away borders, margins, and unnecessary edges. Best for reframing subjects and deleting spatial pixel overhead.',
      icon: Crop,
      href: '/crop',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 text-purple-400',
      badge: 'Spatial Pixel Slice'
    },
    {
      id: 'resize',
      title: 'Resize Image',
      desc: 'Scale down pixel width, height, and overall dimension resolution proportionally or to custom values.',
      icon: Expand,
      href: '/resize-image',
      color: 'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
      badge: 'Resolution Scaling'
    }
  ];

  // Schema for SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ResizePixel Online",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 flex flex-col justify-between selection:bg-brand-primary/30 relative overflow-hidden select-none">
      {/* JSON-LD Script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                ResizePixel Online
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
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary">
              <Zap className="w-3.5 h-3.5 fill-brand-primary animate-pulse" />
              <span>Three Unique Reduction Paths</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Free Online Image Resizer & Compressor
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Compress, resize, or crop images instantly in your browser. Fast, private, and free image optimization with no upload limits.
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

          {/* H2 section: Popular Image Resize Tools */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest text-center">
              Popular Image Resize Tools
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Image Resize Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wide">Image Resize</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/resize-image" className="text-xs text-gray-400 hover:text-white transition-colors">Resize Image Online</Link>
                  <Link href="/resize-image-dimensions" className="text-xs text-gray-400 hover:text-white transition-colors">Resize Image Dimensions</Link>
                  <Link href="/resize-jpg-online" className="text-xs text-gray-400 hover:text-white transition-colors">Resize JPG Online</Link>
                  <Link href="/resize-png-online" className="text-xs text-gray-400 hover:text-white transition-colors">Resize PNG Online</Link>
                  <Link href="/resize-image-to-100x100" className="text-xs text-gray-400 hover:text-white transition-colors">Resize to 100x100 px</Link>
                  <Link href="/resize-image-to-1920x1080" className="text-xs text-gray-400 hover:text-white transition-colors">Resize to 1920x1080 px</Link>
                </div>
              </div>

              {/* Compress Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wide">Compress Image</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/compress-image" className="text-xs text-gray-400 hover:text-white transition-colors">Compress Image Online</Link>
                  <Link href="/resize-image-in-kb" className="text-xs text-gray-400 hover:text-white transition-colors">Resize Image in KB</Link>
                  <Link href="/compress-jpeg-to-50kb" className="text-xs text-gray-400 hover:text-white transition-colors">Compress JPEG to 50KB</Link>
                  <Link href="/compress-png-online" className="text-xs text-gray-400 hover:text-white transition-colors">Compress PNG Online</Link>
                  <Link href="/compress-image-to-50kb" className="text-xs text-gray-400 hover:text-white transition-colors">Compress Image to 50KB</Link>
                  <Link href="/compress-image-to-100kb" className="text-xs text-gray-400 hover:text-white transition-colors">Compress Image to 100KB</Link>
                  <Link href="/compress-image-to-200kb" className="text-xs text-gray-400 hover:text-white transition-colors">Compress Image to 200KB</Link>
                </div>
              </div>

              {/* Passport Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-accent uppercase tracking-wide">Passport & Documents</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/passport-photo-resize" className="text-xs text-gray-400 hover:text-white transition-colors">Passport Photo Resize</Link>
                  <Link href="/signature-resize" className="text-xs text-gray-400 hover:text-white transition-colors">Signature Resize Tool</Link>
                  <Link href="/passport-photo-to-50kb" className="text-xs text-gray-400 hover:text-white transition-colors">Passport Photo to 50KB</Link>
                  <Link href="/photo-for-government-exam" className="text-xs text-gray-400 hover:text-white transition-colors">Photo for Gov Exams</Link>
                </div>
              </div>

              {/* Social Media Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Social Media</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/instagram-post-resizer" className="text-xs text-gray-400 hover:text-white transition-colors">Instagram Post Resizer</Link>
                  <Link href="/instagram-story-resizer" className="text-xs text-gray-400 hover:text-white transition-colors">Instagram Story Resizer</Link>
                  <Link href="/facebook-cover-photo-resizer" className="text-xs text-gray-400 hover:text-white transition-colors">Facebook Cover Resizer</Link>
                  <Link href="/youtube-thumbnail-resizer" className="text-xs text-gray-400 hover:text-white transition-colors">YouTube Thumbnail Resizer</Link>
                  <Link href="/linkedin-banner-resizer" className="text-xs text-gray-400 hover:text-white transition-colors">LinkedIn Banner Resizer</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed H2 SEO Copywriting Guide Sections */}
          <div className="border-t border-white/5 pt-12 space-y-12">
            
            {/* Section 1 */}
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Resize Images to Any Dimension
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                ResizePixel Online lets you change your photo dimensions instantly. Whether you need to scale pixels down proportionally or unlock aspect ratios to set custom height and width targets, our browser-based resizer does it securely. Resize camera raw files, blog headers, and documents with absolute pixel accuracy.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Compress Images Without Losing Quality
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                Need to decrease file weight but keep details crisp? Our compression engine balances visual fidelity with target storage sizes. By stripping out redundant metadata and optimizing high-frequency color ranges, we compress JPEGs, PNGs, and WebPs online without adding blurry artifacts or pixel noise.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Resize Image to Specific KB or MB
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                Many online application systems reject images that exceed size limits like 20KB, 50KB, or 100KB. ResizePixel Online addresses this problem by executing iterative binary search runs locally in your browser cache to compress your files directly below your target KB parameters.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Passport Photo & Signature Resizer
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                Easily format personal documents for passport portals and government exams. ResizePixel Online offers pre-configured setups to crop signatures and passport images to exact guidelines, including 1:1 square borders and 3:1 signature ratios under standard 50KB or 20KB limits.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Convert JPG, PNG & WebP Images
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                Convert image formats easily inside the compressor workspace. Swap transparent PNGs to optimized web JPEGs, convert standard photos to modern WebP files for better website performance, and output fully optimized copies formatted for immediate integration.
              </p>
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
                  q: "How do I resize an image online using ResizePixel?",
                  a: "Upload your image, choose between 'By Percentage' (slider scale) or 'By Dimensions' (exact pixels), enter your target parameters, and download the resized file instantly."
                },
                {
                  q: "Can I resize an image without losing quality?",
                  a: "Yes. By scaling down the pixel dimensions proportionally, you shrink the file weight while keeping the original aspect ratio locked, avoiding visual stretching or squishing."
                },
                {
                  q: "Is it safe to compress my photos on ResizePixel?",
                  a: "Completely. All image processing occurs locally inside your web browser. Your private photos never leave your device, ensuring total security and privacy."
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
      <footer className="p-6 border-t border-white/5 bg-black/15 text-center space-y-4">
        <p className="text-xs text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          ResizePixel Online is a free image editing platform that helps users resize images, compress photos, reduce image size in KB, convert image formats, and prepare photos for websites, social media, passport applications, and online forms. Fast, secure, and accessible from any device.
        </p>
        <p className="text-[11px] text-gray-600 font-light">
          © 2026 ResizePixel Online. Fast, secure client-side Image size Reducer.
        </p>
      </footer>
    </div>
  );
}
