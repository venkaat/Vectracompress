import type { Metadata } from "next";
import ConverterWorkspace from "@/components/tools/ConverterWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convert AVIF to PNG Online Free | ResizePixel Online",
  description: "Convert your AVIF images to high-quality PNG format online for free. Clean local processing, preserves alpha transparency.",
  keywords: ["convert avif to png", "avif to png online", "change avif to png", "avif converter to png"],
};

export default function ConvertAvifToPngPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does converting AVIF to PNG preserve transparency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PNG's alpha channel is fully maintained during AVIF conversion, keeping transparent elements clean."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool upload my images to any server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, all conversions are processed locally inside your web browser using HTML5 Canvas. Your images are never uploaded to any remote servers."
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
        "name": "Convert AVIF to PNG",
        "item": "https://resizepixel.online/convert-avif-to-png"
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
          Convert AVIF to PNG Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Need to convert AVIF images to PNG? Our free AVIF to PNG converter transforms files right inside your browser, keeping your transparent backgrounds fully intact.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          AVIF is a next-generation web format, but PNG is widely preferred for design suites, offline documents, and older browsers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Preserves transparent alpha channel</li>
            <li>100% private, local browser processing</li>
            <li>Fast, secure conversion</li>
            <li>High-fidelity lossless rendering</li>
            <li>No software downloads required</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended Uses
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Converting next-generation AVIF assets (logos, icons, and illustrations) back into highly editable layout layers for Photoshop, Illustrator, or older publishing software that does not natively open AVIF.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Does converting AVIF to PNG preserve transparency?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, PNG's alpha channel is fully maintained during AVIF conversion, keeping transparent elements clean.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Does this tool upload my images to any server?</h5>
            <p className="text-xs text-gray-400 font-light">No, all conversions are processed locally inside your web browser using HTML5 Canvas. Your images are never uploaded to any remote servers.</p>
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
      title="Convert AVIF to PNG"
      subtitle="Transform next-generation AVIF images into widely compatible PNG graphics. 100% client-side."
      pageSuffix="AVIF to PNG"
      seoSection={seoSection}
    />
  );
}
