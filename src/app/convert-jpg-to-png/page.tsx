import type { Metadata } from "next";
import ConverterWorkspace from "@/components/tools/ConverterWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convert JPG to PNG Online Free | ResizePixel Online",
  description: "Convert your JPG/JPEG images to high-quality PNG format online for free. Clean local processing, preserves color fidelity.",
  keywords: ["convert jpg to png", "jpg to png online", "change jpeg to png", "jpg to png converter"],
};

export default function ConvertJpgToPngPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Will converting JPG to PNG make my image transparent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, because the source JPG does not possess transparent alpha channels, the output PNG will have the same solid background. To make it transparent, you would need to run a background removal tool."
        }
      },
      {
        "@type": "Question",
        "name": "Are my files uploaded to any servers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, all conversion steps run directly inside your local web browser sandbox using HTML5 Canvas. Your images are never uploaded to any remote servers."
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
        "name": "Convert JPG to PNG",
        "item": "https://resizepixel.online/convert-jpg-to-png"
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
          Convert JPG to PNG Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Quickly convert JPG photos to PNG using our secure client-side converter. Ensure your images maintain maximum quality without artifacts.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          PNG format is ideal for logo creation, typography, design assets, and overlays where compression artifacts should be avoided.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>High-fidelity PNG rendering</li>
            <li>Lossless format export</li>
            <li>100% private local sandbox conversion</li>
            <li>Fast, secure processing</li>
            <li>Supports large files</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended Uses
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Converting compressed JPG photographs or web graphics back to lossless PNG format to prepare them for design overlays, layer composites, or high-quality edits.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Will converting JPG to PNG make my image transparent?</h5>
            <p className="text-xs text-gray-400 font-light">No, because the source JPG does not possess transparent alpha channels, the output PNG will have the same solid background. To make it transparent, you would need to run a background removal tool.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Are my files uploaded to any servers?</h5>
            <p className="text-xs text-gray-400 font-light">No, all conversion steps run directly inside your local web browser sandbox using HTML5 Canvas. Your images are never uploaded to any remote servers.</p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div className="border-t border-white/5 pt-6 space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Related Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          <Link href="/convert-image-format" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert Image Format</Link>
          <Link href="/convert-webp-to-png" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert WebP to PNG</Link>
          <Link href="/convert-webp-to-jpg" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert WebP to JPG</Link>
          <Link href="/convert-avif-to-png" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert AVIF to PNG</Link>
          <Link href="/convert-avif-to-jpg" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert AVIF to JPG</Link>
          <Link href="/convert-png-to-jpg" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert PNG to JPG</Link>
        </div>
      </div>
    </div>
  );

  return (
    <ConverterWorkspace
      defaultTargetFormat="png"
      title="Convert JPG to PNG"
      subtitle="Transform classic JPG/JPEG photographs into high-quality PNG format. 100% client-side."
      pageSuffix="JPG to PNG"
      seoSection={seoSection}
    />
  );
}
