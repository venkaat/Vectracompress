import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image to 300x300 Pixels Online Free | ResizePixel Online",
  description: "Resize and scale your image dimensions to exactly 300x300 pixels online for free. Adjust height and width proportionally. Safe, secure, and client-side.",
  keywords: ["resize image to 300x300", "make image 300x300 pixels", "resize 300x300", "image resizer 300x300"],
};

export default function ResizeTo300x300Page() {
  return (
    <ResizeWorkspace
      defaultWidth={300}
      defaultHeight={300}
      title="Resize Image to 300x300 Pixels"
      subtitle="Optimize dimensions to exactly 300x300 pixels. Adjust scale and download instantly."
      pageSuffix="Resize to 300x300"
    />
  );
}
