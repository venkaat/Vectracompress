import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";
import Link from "next/link";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Resizer Online Free | ResizePixel Online",
  description: "Resize and format custom video thumbnails to the recommended 1280x720 pixels (16:9 aspect ratio) for HD displays. Safe and secure.",
  keywords: ["youtube thumbnail resizer", "resize youtube thumbnail 1280x720", "make youtube thumbnail 720p", "thumbnail resizer online"],
};

export default function YoutubeThumbnailResizerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best size for YouTube thumbnails?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1280 × 720 pixels."
        }
      },
      {
        "@type": "Question",
        "name": "Can I resize JPG and PNG files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, both formats are supported."
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
        "name": "YouTube Thumbnail Resizer",
        "item": "https://resizepixel.online/youtube-thumbnail-resizer"
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
          Resize Images for YouTube Thumbnails Online
        </h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Create perfectly sized YouTube thumbnails using our free YouTube Thumbnail Resizer. Resize any image to YouTube's recommended thumbnail dimensions and improve your video's click-through rate.
        </p>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          A high-quality thumbnail can significantly increase video views and engagement. Our tool helps creators, marketers, and businesses create professional-looking thumbnails in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-primary">
            Features
          </h4>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 font-light">
            <li>Resize to YouTube thumbnail dimensions</li>
            <li>Maintain aspect ratio</li>
            <li>Fast online processing</li>
            <li>No registration required</li>
            <li>Mobile-friendly</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider text-brand-secondary">
            Recommended YouTube Thumbnail Size
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            The recommended YouTube thumbnail size is 1280 × 720 pixels with a 16:9 aspect ratio.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">What is the best size for YouTube thumbnails?</h5>
            <p className="text-xs text-gray-400 font-light">1280 × 720 pixels.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <h5 className="text-xs font-bold text-white">Can I resize JPG and PNG files?</h5>
            <p className="text-xs text-gray-400 font-light">Yes, both formats are supported.</p>
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
      defaultWidth={1280}
      defaultHeight={720}
      title="YouTube Thumbnail Resizer"
      subtitle="Format your custom video thumbnails to the recommended YouTube standard of 1280x720 pixels (720p)."
      pageSuffix="YouTube Thumbnail Resizer"
      specialInstructions={[
        "Official dimensions: 1280x720 pixels (minimum width of 640 pixels).",
        "Aspect ratio should remain 16:9 for perfect player layout.",
        "Ensure file size remains under 2MB for upload acceptance."
      ]}
      seoSection={seoSection}
    />
  );
}
