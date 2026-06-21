import type { Metadata } from "next";
import ConverterWorkspace from "@/components/tools/ConverterWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convert WebP to JPG Online Free | ResizePixel Online",
  description: "Convert your WebP images to highly compatible JPG/JPEG format online for free. Adjust quality and compress file size locally.",
  keywords: ["convert webp to jpg", "webp to jpg online", "change webp to jpeg", "webp to jpeg converter"],
};

export default function ConvertWebpToJpgPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I adjust the file size of the output JPG?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can slide the quality indicator to shrink or expand the compressed file size in real-time."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to convert private photos here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all conversion steps run directly in your local web browser sandbox. No image data is transmitted or stored on any remote servers."
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
        "name": "Convert WebP to JPG",
        "item": "https://resizepixel.online/convert-webp-to-jpg"
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
          Convert WebP to JPG Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Quickly convert WebP photos to JPG using our secure offline-first tool. Customize the quality index to compress or preserve resolution as needed.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          While WebP offers high modern compression, JPG is the universal standard for sharing via email, uploading to official portals, and displaying on older browsers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Proportional JPG output encoding</li>
            <li>Variable quality controls</li>
            <li>Real-time output file size prediction</li>
            <li>Full client-side security</li>
            <li>Easy drag-and-drop workflow</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended Uses
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Preparing downloaded web images for forms, applications, or submission portals that only accept classic `.jpg` or `.jpeg` extension uploads.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Can I adjust the file size of the output JPG?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, you can slide the quality indicator to shrink or expand the compressed file size in real-time.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Is it safe to convert private photos here?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, all conversion steps run directly in your local web browser sandbox. No image data is transmitted or stored on any remote servers.</p>
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
      defaultTargetFormat="jpeg"
      title="Convert WebP to JPG"
      subtitle="Transform modern WebP formats into universally supported JPG/JPEG files. Private and secure."
      pageSuffix="WebP to JPG"
      seoSection={seoSection}
    />
  );
}
