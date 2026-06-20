import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instagram Story Resizer Online Free | ResizePixel Online",
  description: "Resize and format photos to the standard Instagram story size of 1080x1920 pixels (9:16 aspect ratio) online for free. Clean local processing.",
  keywords: ["instagram story resizer", "instagram story dimensions 1080x1920", "resize photo for instagram story", "story resizer"],
};

export default function InstagramStoryResizerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the recommended size for Instagram stories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1080 × 1920 pixels with a 9:16 aspect ratio."
        }
      },
      {
        "@type": "Question",
        "name": "Will my image be cropped during resizing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your image has a different aspect ratio, you can adjust it to prevent stretching or crop it beforehand."
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
        "name": "Instagram Story Resizer",
        "item": "https://resizepixel.online/instagram-story-resizer"
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
          Resize Instagram Stories Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Create perfectly sized Instagram stories using our free Instagram Story Resizer. Easily resize any image to the recommended Instagram story dimensions (1080 x 1920 pixels) to avoid unwanted cropping or stretching when you upload.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Whether you are sharing photos of products, personal moments, layouts, or announcements, our tool ensures your stories look crisp and professional on all mobile devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Resize to Instagram story dimensions</li>
            <li>Preserve image quality</li>
            <li>Fast and secure client-side processing</li>
            <li>Works on mobile and desktop browsers</li>
            <li>No registration or downloads required</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended Instagram Story Size
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            The recommended size for Instagram stories is 1080 × 1920 pixels, with an aspect ratio of 9:16.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">What is the recommended size for Instagram stories?</h5>
            <p className="text-xs text-gray-400 font-light">1080 × 1920 pixels with a 9:16 aspect ratio.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Will my image be cropped during resizing?</h5>
            <p className="text-xs text-gray-400 font-light">If your image has a different aspect ratio, you can adjust it to prevent stretching or crop it beforehand.</p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div className="border-t border-white/5 pt-6 space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Related Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          <Link href="/resize-image" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Resize Image Online</Link>
          <Link href="/facebook-cover-photo-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Facebook Cover Photo Resizer</Link>
          <Link href="/youtube-thumbnail-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">YouTube Thumbnail Resizer</Link>
          <Link href="/instagram-post-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Instagram Post Resizer</Link>
          <Link href="/linkedin-banner-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">LinkedIn Banner Resizer</Link>
          <Link href="/compress-image" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image Online</Link>
        </div>
      </div>
    </div>
  );

  return (
    <ResizeWorkspace
      defaultWidth={1080}
      defaultHeight={1920}
      title="Instagram Story Resizer"
      subtitle="Optimize and format your portrait uploads to exactly 1080x1920 pixels for Instagram stories."
      pageSuffix="Instagram Story Resizer"
      specialInstructions={[
        "Recommended dimensions: 1080x1920 pixels (9:16 portrait ratio).",
        "Widescreen layouts may require cropping before resizing to fit."
      ]}
      seoSection={seoSection}
    />
  );
}
