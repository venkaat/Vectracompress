import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image to 1920x1080 Pixels Online Free | ResizePixel Online",
  description: "Resize and scale your image dimensions to exactly 1920x1080 Full HD online for free. Adjust height and width proportionally. Safe, secure, and client-side.",
  keywords: ["resize image to 1920x1080", "make image 1920x1080 pixels", "resize 1920x1080", "image resizer 1920x1080"],
};

export default function ResizeTo1920x1080Page() {
  return (
    <ResizeWorkspace
      defaultWidth={1920}
      defaultHeight={1080}
      title="Resize Image to 1920x1080 Pixels"
      subtitle="Optimize dimensions to Full HD (1920x1080 pixels). Adjust scale and download instantly."
      pageSuffix="Resize to 1920x1080"
    />
  );
}
