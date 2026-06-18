import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress PNG Online Free | Shrink PNG File Size - ResizePixel Online",
  description: "Compress and optimize PNG files online for free. Strip metadata and reduce PNG file weight locally while maintaining crisp details.",
  keywords: ["compress png online", "shrink png file size", "png compressor", "optimize png online"],
};

export default function CompressPngOnlinePage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={100}
      title="Compress PNG Online"
      subtitle="Reduce PNG file sizes securely and locally in your browser. Perfect for alpha transparency assets."
      pageSuffix="Compress PNG Online"
    />
  );
}
