import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image Dimensions Online Free | Pixel Resizer - ResizePixel Online",
  description: "Resize and scale your image dimensions in pixels online for free. Adjust height and width proportionally. Safe, secure, and client-side.",
  keywords: ["resize image dimensions", "change photo dimensions online", "scale image pixels online", "pixel resizer"],
};

export default function ResizeImageDimensionsPage() {
  return (
    <ResizeWorkspace
      title="Resize Image Dimensions"
      subtitle="Downscale and redraw image dimensions in pixels proportionally. Clean client-side browser optimization."
      pageSuffix="Resize Image Dimensions"
    />
  );
}
