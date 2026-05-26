import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress Image to 100KB Online for Free | AuraCompress",
  description: "Shrink your images and photos under 100KB instantly. High-fidelity browser-based compression. 100% private, free, and no signups required.",
  keywords: ["compress image to 100kb", "image compressor under 100kb", "compress photo to 100kb online", "resize image to 100kb"],
};

export default function CompressTo100kbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={100}
      title="Compress Image to 100KB"
      subtitle="Reduce photo size under 100KB instantly. Secure, browser-based local optimization."
      pageSuffix="Compress Image to 100KB"
    />
  );
}
