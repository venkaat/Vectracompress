import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress Image to 50KB Online for Free | ResizePixel Online",
  description: "Shrink your images and photos under 50KB instantly. High-fidelity browser-based compression. 100% private, free, and no signups required.",
  keywords: ["compress image to 50kb", "image compressor under 50kb", "compress photo to 50kb online", "resize image to 50kb"],
};

export default function CompressTo50kbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      title="Compress Image to 50KB"
      subtitle="Reduce photo size under 50KB instantly. Secure, browser-based local optimization."
      pageSuffix="Compress Image to 50KB"
    />
  );
}
