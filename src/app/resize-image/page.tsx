import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image Online Free | Image Resizer in Pixels - ResizePixel Online",
  description: "Scale and resize image dimensions in pixels online for free. Adjust height and width proportionally. Safe, client-side, and no upload limits.",
  keywords: ["resize image online", "image resizer", "scale dimensions", "change image size in pixels"],
};

export default function ResizeImagePage() {
  return (
    <ResizeWorkspace
      title="Resize Image Online"
      subtitle="Downscale pixel width and height proportionally or enter custom dimensions. Optimized 100% locally in your browser."
      pageSuffix="Resize Image"
    />
  );
}
