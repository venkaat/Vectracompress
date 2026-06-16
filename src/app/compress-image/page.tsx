import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress Image Online Free | Reduce File Size in KB - ResizePixel Online",
  description: "Shrink image files and photos under your exact KB limit. Adjust target limits and download optimized outputs instantly. 100% private, local and secure.",
  keywords: ["compress image online", "reduce image size in kb", "image compressor", "shrink photo size in kb"],
};

export default function CompressImagePage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={100}
      title="Compress Image Online"
      subtitle="Shrink your image file weight instantly. Select a target size in KB and compress securely, 100% locally."
      pageSuffix="Compress Image"
    />
  );
}
