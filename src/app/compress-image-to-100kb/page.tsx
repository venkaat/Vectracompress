import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compress Image to 100KB Online for Free | ResizePixel Online",
  description: "Shrink your images and photos under 100KB instantly. High-fidelity browser-based compression. 100% private, free, and no signups required.",
  keywords: ["compress image to 100kb", "image compressor under 100kb", "compress photo to 100kb online", "resize image to 100kb"],
};

export default function CompressTo100kbPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I compress multiple image formats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, JPG, JPEG, PNG, and WebP are supported."
        }
      },
      {
        "@type": "Question",
        "name": "Is the tool free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the tool is completely free to use online."
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
        "name": "Compress Image to 100KB",
        "item": "https://resizepixel.online/compress-image-to-100kb"
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
          Compress Images to 100KB Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Reduce image file sizes quickly with our Compress Image to 100KB tool. Upload your photo and compress it to approximately 100KB without installing software.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          This tool is useful for websites, online forms, email attachments, social media uploads, and document submissions that have image size restrictions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Compress photos to 100KB</li>
            <li>Preserve image quality</li>
            <li>Works with JPG, PNG, JPEG, and WebP</li>
            <li>Fast online compression</li>
            <li>Free and secure</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Benefits
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Faster uploads</li>
            <li>Reduced storage usage</li>
            <li>Improved website performance</li>
            <li>Easier email sharing</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Can I compress multiple image formats?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, JPG, JPEG, PNG, and WebP are supported.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Is the tool free?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, the tool is completely free to use online.</p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div className="border-t border-white/5 pt-6 space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Related Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          <Link href="/compress-image" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image Online</Link>
          <Link href="/compress-image-to-50kb" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image to 50KB</Link>
          <Link href="/compress-image-to-200kb" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image to 200KB</Link>
          <Link href="/compress-jpeg-to-50kb" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress JPEG to 50KB</Link>
          <Link href="/compress-png-online" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress PNG Online</Link>
          <Link href="/resize-image" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Resize Image Online</Link>
        </div>
      </div>
    </div>
  );

  return (
    <CompressorWorkspace
      defaultTargetSizeKb={100}
      title="Compress Image to 100KB"
      subtitle="Reduce photo size under 100KB instantly. Secure, browser-based local optimization."
      pageSuffix="Compress Image to 100KB"
      seoSection={seoSection}
    />
  );
}
