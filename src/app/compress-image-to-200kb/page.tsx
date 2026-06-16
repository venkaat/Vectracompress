import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress Image to 200KB Online Free | ResizePixel Online",
  description: "Shrink your image and photo file size under 200KB online for free. Clean local compression. Safe, client-side, with no upload limits.",
  keywords: ["compress image to 200kb", "image compressor under 200kb", "compress photo to 200kb online", "resize image to 200kb"],
};

export default function CompressTo200kbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={200}
      title="Compress Image to 200KB"
      subtitle="Reduce photo file weight under 200KB instantly. Secure, browser-based local optimization."
      pageSuffix="Compress Image to 200KB"
    />
  );
}
