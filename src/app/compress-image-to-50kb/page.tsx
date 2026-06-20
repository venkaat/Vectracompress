import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compress Image to 50KB Online for Free | ResizePixel Online",
  description: "Shrink your images and photos under 50KB instantly. High-fidelity browser-based compression. 100% private, free, and no signups required.",
  keywords: ["compress image to 50kb", "image compressor under 50kb", "compress photo to 50kb online", "resize image to 50kb"],
};

export default function CompressTo50kbPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I compress a photo to exactly 50KB?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool automatically optimizes images to meet the target size."
        }
      },
      {
        "@type": "Question",
        "name": "Will image quality be affected?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We aim to achieve the target size while maintaining the best possible quality."
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
        "name": "Compress Image to 50KB",
        "item": "https://resizepixel.online/compress-image-to-50kb"
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
          Compress Images to 50KB Online
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Need to reduce an image file size to 50KB? Our free image compression tool helps you compress JPG, JPEG, PNG, and WebP images while maintaining excellent quality.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          This tool is ideal for government forms, passport applications, job applications, exam registrations, and websites that require image uploads below 50KB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Compress images to 50KB</li>
            <li>Supports JPG, PNG, JPEG, and WebP</li>
            <li>Fast online processing</li>
            <li>No software required</li>
            <li>Mobile-friendly</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Common Uses
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Passport applications</li>
            <li>Government forms</li>
            <li>Online registrations</li>
            <li>Job portals</li>
            <li>Educational applications</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Can I compress a photo to exactly 50KB?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, our tool automatically optimizes images to meet the target size.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Will image quality be affected?</h5>
            <p className="text-xs text-gray-400 font-light">We aim to achieve the target size while maintaining the best possible quality.</p>
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
          <Link href="/compress-image-to-100kb" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image to 100KB</Link>
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
      defaultTargetSizeKb={50}
      title="Compress Image to 50KB"
      subtitle="Reduce photo size under 50KB instantly. Secure, browser-based local optimization."
      pageSuffix="Compress Image to 50KB"
      seoSection={seoSection}
    />
  );
}
