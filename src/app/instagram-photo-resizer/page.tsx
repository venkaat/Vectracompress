import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Instagram Photo Resizer Online Free | ResizePixel Online",
  description: "Resize and scale photos to the official Instagram 1:1 post standard (1080x1080 pixels). Optimize for social sharing with zero quality loss.",
  keywords: ["instagram photo resizer", "resize photo for instagram", "instagram post size 1080x1080", "social media resizer"],
};

export default function InstagramPhotoResizerPage() {
  return (
    <ResizeWorkspace
      defaultWidth={1080}
      defaultHeight={1080}
      title="Instagram Post Resizer"
      subtitle="Resize and format photos to the standard Instagram post size (1080x1080 px) instantly."
      pageSuffix="Instagram Resizer"
      specialInstructions={[
        "Ideal output format: 1080x1080 pixels (Square).",
        "Keep 'Lock aspect ratio' checked to avoid stretching the image.",
        "Use crop before resizing if the original shape is widescreen."
      ]}
    />
  );
}
