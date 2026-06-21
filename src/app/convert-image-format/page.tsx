import type { Metadata } from "next";
import ConverterWorkspace from "@/components/tools/ConverterWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convert Image Format Online Free | ResizePixel Online",
  description: "Convert images between WebP, AVIF, PNG, and JPEG online for free. Control quality and optimize output format client-side in seconds.",
  keywords: ["convert image format", "image converter online", "change image format", "webp avif png jpeg converter"],
};

export default function ConvertImageFormatPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are my files uploaded to any servers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, all conversions are processed locally inside your web browser. Your images never leave your device."
        }
      },
      {
        "@type": "Question",
        "name": "Which formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can import and convert images to WebP, AVIF, PNG, and JPEG format."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://resizepixel.online/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Convert Image Format",
        "item": "https://resizepixel.online/convert-image-format"
      }
    ]
  };

  const seoSection = (
    <div className="border-t border-white/5 pt-10 mt-10 space-y-8 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Convert Image Formats Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Use our free Image Format Converter to change image types online. Easily convert between modern formats like WebP and AVIF or classic formats like PNG and JPEG with zero server uploads.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Control quality slider settings to optimize output file size or keep lossless compression depending on your project needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Client-side browser conversion</li>
            <li>Support for WebP, AVIF, PNG, JPEG</li>
            <li>Quality compression controls</li>
            <li>100% private and secure</li>
            <li>Instantly download optimized copies</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Supported Formats
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li><strong>WebP</strong>: modern, high compression</li>
            <li><strong>AVIF</strong>: next-generation file format</li>
            <li><strong>PNG</strong>: lossless, supports transparency</li>
            <li><strong>JPEG/JPG</strong>: universally compatible format</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Are my files uploaded to any servers?</h5>
            <p className="text-xs text-gray-400 font-light">No, all conversions are processed locally inside your web browser. Your images never leave your device.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Which formats are supported?</h5>
            <p className="text-xs text-gray-400 font-light">You can import and convert images to WebP, AVIF, PNG, and JPEG format.</p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div className="border-t border-white/5 pt-6 space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Related Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          <Link href="/convert-webp-to-png" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert WebP to PNG</Link>
          <Link href="/convert-webp-to-jpg" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert WebP to JPG</Link>
          <Link href="/convert-avif-to-png" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert AVIF to PNG</Link>
          <Link href="/convert-avif-to-jpg" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert AVIF to JPG</Link>
          <Link href="/convert-png-to-jpg" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert PNG to JPG</Link>
          <Link href="/convert-jpg-to-png" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert JPG to PNG</Link>
        </div>
      </div>
    </div>
  );

  return (
    <ConverterWorkspace
      defaultTargetFormat="png"
      title="Convert Image Format"
      subtitle="Change image file types between PNG, JPG, WebP, and AVIF. Private client-side optimization."
      pageSuffix="Format Converter"
      seoSection={seoSection}
    />
  );
}
