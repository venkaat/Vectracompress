import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress Image File Online - Exact Size in KB | AuraCompress",
  description: "Shrink image files and photos under your exact KB limit. Adjust target limits and download optimized outputs instantly. 100% private, local and secure.",
  keywords: ["compress image online", "reduce image size in kb", "image compressor", "shrink photo size in kb"],
};

export default function CompressPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={100}
      title="Compress File Size"
      subtitle="Shrink your image to your exact KB limit. Adjust target limits and download instantly, 100% privately."
      pageSuffix="Reduce by Compression"
    />
  );
}
