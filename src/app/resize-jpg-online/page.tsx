import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize JPG Online Free | JPG & JPEG Image Resizer - ResizePixel Online",
  description: "Resize and scale JPG and JPEG images online for free. Adjust pixel dimensions and proportions locally. Safe, private, and fast.",
  keywords: ["resize jpg online", "jpeg image resizer", "change jpg dimensions online", "jpg resizer"],
};

export default function ResizeJpgOnlinePage() {
  return (
    <ResizeWorkspace
      title="Resize JPG Online"
      subtitle="Optimize and redraw JPG/JPEG dimensions proportionally. Clean browser-based local optimization."
      pageSuffix="Resize JPG Online"
    />
  );
}
