import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Instagram Story Resizer Online Free | ResizePixel Online",
  description: "Resize and format photos to the standard Instagram story size of 1080x1920 pixels (9:16 aspect ratio) online for free. Clean local processing.",
  keywords: ["instagram story resizer", "instagram story dimensions 1080x1920", "resize photo for instagram story"],
};

export default function InstagramStoryResizerPage() {
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
    />
  );
}
