import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Instagram Post Resizer Online Free | ResizePixel Online",
  description: "Resize and scale photos to the official Instagram post standard of 1080x1080 pixels online for free. Adjust proportions and download instantly.",
  keywords: ["instagram post resizer", "instagram post size 1080x1080", "resize image for instagram post", "square resizer"],
};

export default function InstagramPostResizerPage() {
  return (
    <ResizeWorkspace
      defaultWidth={1080}
      defaultHeight={1080}
      title="Instagram Post Resizer"
      subtitle="Optimize and format your square grid posts to exactly 1080x1080 pixels."
      pageSuffix="Instagram Post Resizer"
      specialInstructions={[
        "Standard post size: 1080x1080 pixels (1:1 Ratio).",
        "Keep aspect ratios locked to prevent stretching."
      ]}
    />
  );
}
