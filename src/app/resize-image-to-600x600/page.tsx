import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image to 600x600 Pixels Online Free | ResizePixel Online",
  description: "Resize and scale your image dimensions to exactly 600x600 pixels online for free. Adjust height and width proportionally. Safe, secure, and client-side.",
  keywords: ["resize image to 600x600", "make image 600x600 pixels", "resize 600x600", "image resizer 600x600"],
};

export default function ResizeTo600x600Page() {
  return (
    <ResizeWorkspace
      defaultWidth={600}
      defaultHeight={600}
      title="Resize Image to 600x600 Pixels"
      subtitle="Optimize dimensions to exactly 600x600 pixels. Adjust scale and download instantly."
      pageSuffix="Resize to 600x600"
    />
  );
}
