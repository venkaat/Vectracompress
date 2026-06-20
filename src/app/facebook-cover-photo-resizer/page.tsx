import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Facebook Cover Photo Resizer Online Free | ResizePixel Online",
  description: "Resize and format photos to the standard Facebook cover photo size of 820x312 pixels online for free. Clean local processing.",
  keywords: ["facebook cover photo resizer", "resize photo for facebook cover", "facebook cover dimension 820x312", "cover photo resizer"],
};

export default function FacebookCoverPhotoResizerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the ideal Facebook cover photo size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "851 × 315 pixels is the recommended size."
        }
      },
      {
        "@type": "Question",
        "name": "Will resizing reduce image quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool is designed to preserve image quality while resizing."
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
        "name": "Facebook Cover Photo Resizer",
        "item": "https://resizepixel.online/facebook-cover-photo-resizer"
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
          Resize Facebook Cover Photos Online Free
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Use our Facebook Cover Photo Resizer to instantly resize images for Facebook profiles, pages, groups, and business accounts. Upload your image, choose the correct dimensions, and download a perfectly sized Facebook cover photo in seconds.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          A properly sized Facebook cover image helps your profile look professional and prevents important content from being cropped on mobile devices. Whether you're creating a cover for a personal account, business page, event, or community group, our tool makes resizing simple.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Resize images to Facebook cover dimensions</li>
            <li>Maintain image quality</li>
            <li>No software installation required</li>
            <li>Works on desktop and mobile devices</li>
            <li>Fast and secure online processing</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended Facebook Cover Size
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            For best results, Facebook recommends a cover image size of 851 × 315 pixels. Using the correct dimensions ensures your image displays properly across devices.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">What is the ideal Facebook cover photo size?</h5>
            <p className="text-xs text-gray-400 font-light">851 × 315 pixels is the recommended size.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Will resizing reduce image quality?</h5>
            <p className="text-xs text-gray-400 font-light">Our tool is designed to preserve image quality while resizing.</p>
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
          <Link href="/youtube-thumbnail-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">YouTube Thumbnail Resizer</Link>
          <Link href="/instagram-post-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Instagram Post Resizer</Link>
          <Link href="/instagram-story-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Instagram Story Resizer</Link>
          <Link href="/linkedin-banner-resizer" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">LinkedIn Banner Resizer</Link>
          <Link href="/compress-image" className="px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-brand-primary/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">Compress Image Online</Link>
        </div>
      </div>
    </div>
  );

  return (
    <ResizeWorkspace
      defaultWidth={851}
      defaultHeight={315}
      title="Facebook Cover Photo Resizer"
      subtitle="Optimize and format your header graphics to exactly 851x315 pixels for profile background dimensions."
      pageSuffix="Facebook Cover Photo Resizer"
      specialInstructions={[
        "Standard cover dimensions: 851x315 pixels.",
        "Keep central elements focused so they scale properly on mobile layout."
      ]}
      seoSection={seoSection}
    />
  );
}
