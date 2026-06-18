import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Compress JPEG to 50KB Online Free | ResizePixel Online",
  description: "Compress and shrink your JPEG and JPG photos under 50KB online for free. Adjust quality compression locally and securely in your browser.",
  keywords: ["compress jpeg to 50kb", "compress jpg to 50kb online", "resize jpeg under 50kb", "jpeg compressor"],
};

export default function CompressJpegTo50kbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      title="Compress JPEG to 50KB"
      subtitle="Reduce JPEG or JPG photo file weight under 50KB. Clean local browser-based compression."
      pageSuffix="Compress JPEG to 50KB"
    />
  );
}
