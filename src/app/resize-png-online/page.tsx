import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize PNG Online Free | PNG Image Resizer - ResizePixel Online",
  description: "Resize and scale PNG images online for free. Adjust height, width, and transparent pixels locally. Safe, client-side, and secure.",
  keywords: ["resize png online", "png resizer", "scale png dimensions", "change png dimensions online"],
};

export default function ResizePngOnlinePage() {
  return (
    <ResizeWorkspace
      title="Resize PNG Online"
      subtitle="Optimize and redraw PNG dimensions proportionally. Fully secure in-browser local processing."
      pageSuffix="Resize PNG Online"
    />
  );
}
