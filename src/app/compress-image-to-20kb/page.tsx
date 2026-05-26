import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress Image to 20KB Online for Free | AuraCompress",
  description: "Shrink your images and photos under 20KB instantly. High-fidelity browser-based compression. 100% private, free, and no signups required.",
  keywords: ["compress image to 20kb", "image compressor under 20kb", "compress photo to 20kb online", "resize image to 20kb"],
};

export default function CompressTo20kbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={20}
      title="Compress Image to 20KB"
      subtitle="Reduce photo size under 20KB instantly. Secure, browser-based local optimization."
      pageSuffix="Compress Image to 20KB"
    />
  );
}
