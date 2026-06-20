import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LinkedIn Banner Resizer Online Free | ResizePixel Online",
  description: "Resize and optimize profile background covers to the recommended LinkedIn banner size of 1584x396 pixels. Fast, secure, and client-side.",
  keywords: ["linkedin banner resizer", "linkedin cover photo size 1584x396", "resize background photo for linkedin", "cover resizer"],
};

export default function LinkedinBannerResizerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best LinkedIn banner size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1584 × 396 pixels is the recommended size."
        }
      },
      {
        "@type": "Question",
        "name": "Can I resize company page banners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool supports various LinkedIn banner formats."
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
        "name": "LinkedIn Banner Resizer",
        "item": "https://resizepixel.online/linkedin-banner-resizer"
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
          Resize LinkedIn Banners Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Use our LinkedIn Banner Resizer to easily format your background photo to the recommended dimensions of 1584 x 396 pixels. Make a strong professional impression with a perfectly aligned cover image.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          A professional background cover helps your LinkedIn profile stand out. Our tool handles the resizing in your browser, keeping your corporate or personal graphics sharp and properly proportioned.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Resize to LinkedIn banner dimensions</li>
            <li>Maintain image quality</li>
            <li>Safe local browser processing</li>
            <li>No signup or email required</li>
            <li>Compatible with JPG, PNG, and WebP</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended LinkedIn Banner Size
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Standard LinkedIn background banner dimensions are 1584 × 396 pixels, with a 4:1 aspect ratio.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">What is the best LinkedIn banner size?</h5>
            <p className="text-xs text-gray-400 font-light">1584 × 396 pixels.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Can I resize company page banners?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, our tool supports various LinkedIn banner formats.</p>
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
          <Link href="/instagram-story-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Instagram Story Resizer</Link>
          <Link href="/compress-image" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image Online</Link>
        </div>
      </div>
    </div>
  );

  return (
    <ResizeWorkspace
      defaultWidth={1584}
      defaultHeight={396}
      title="LinkedIn Banner Resizer"
      subtitle="Optimize and format your professional background cover to exactly 1584x396 pixels."
      pageSuffix="LinkedIn Banner Resizer"
      specialInstructions={[
        "Standard LinkedIn background banner dimensions: 1584x396 pixels.",
        "Aspect ratio: 4:1.",
        "Ensure logos or text are offset from the left corner (where the profile picture overlays on desktop)."
      ]}
      seoSection={seoSection}
    />
  );
}
