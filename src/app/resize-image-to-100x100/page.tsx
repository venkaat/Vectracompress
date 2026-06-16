import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image to 100x100 Pixels Online Free | ResizePixel Online",
  description: "Resize and scale your image dimensions to exactly 100x100 pixels online for free. Adjust height and width proportionally. Safe, secure, and client-side.",
  keywords: ["resize image to 100x100", "make image 100x100 pixels", "resize 100x100", "image resizer 100x100"],
};

export default function ResizeTo100x100Page() {
  return (
    <ResizeWorkspace
      defaultWidth={100}
      defaultHeight={100}
      title="Resize Image to 100x100 Pixels"
      subtitle="Optimize dimensions to exactly 100x100 pixels. Adjust scale and download instantly."
      pageSuffix="Resize to 100x100"
    />
  );
}
