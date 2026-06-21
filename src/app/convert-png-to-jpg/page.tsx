import type { Metadata } from "next";
import ConverterWorkspace from "@/components/tools/ConverterWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convert PNG to JPG Online Free | ResizePixel Online",
  description: "Convert your PNG images to highly compatible JPG/JPEG format online for free. Adjust quality, compress file size, and remove transparent backgrounds.",
  keywords: ["convert png to jpg", "png to jpg online", "change png to jpeg", "png to jpeg converter"],
};

export default function ConvertPngToJpgPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What happens to transparent backgrounds in PNG?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Transparent regions in the source PNG will automatically be filled with a solid white background since the JPG/JPEG format does not support transparency."
        }
      },
      {
        "@type": "Question",
        "name": "Can I adjust the file size of the output JPG?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can adjust the compression quality slider to reduce the file size of the converted JPG."
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
        "name": "Convert PNG to JPG",
        "item": "https://resizepixel.online/convert-png-to-jpg"
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
          Convert PNG to JPG Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Easily convert PNG images to JPG format using our free online converter. Transparency in the PNG file will automatically blend with a clean white background during export.
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
            <li>Auto-blends transparency with white background</li>
            <li>Variable quality controls</li>
            <li>Real-time size difference indicators</li>
            <li>100% private client-side processing</li>
            <li>Fast, secure conversion</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended Uses
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Optimizing bulky screenshot files, transparent web mockups, or camera exports to save digital space and comply with email or upload constraints.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">What happens to transparent backgrounds in PNG?</h5>
            <p className="text-xs text-gray-400 font-light">Transparent regions in the source PNG will automatically be filled with a solid white background since the JPG/JPEG format does not support transparency.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Can I adjust the file size of the output JPG?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, you can adjust the compression quality slider to reduce the file size of the converted JPG.</p>
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
          <Link href="/convert-jpg-to-png" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Convert JPG to PNG</Link>
        </div>
      </div>
    </div>
  );

  return (
    <ConverterWorkspace
      defaultTargetFormat="jpeg"
      title="Convert PNG to JPG"
      subtitle="Transform lossless PNG graphics into highly compatible JPG/JPEG images. 100% client-side."
      pageSuffix="PNG to JPG"
      seoSection={seoSection}
    />
  );
}
