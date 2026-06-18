import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Resize Image in KB Online Free | File Size Compressor - ResizePixel Online",
  description: "Resize and reduce your image file size in KB online for free. Adjust target file weights under 20KB, 50KB, or 100KB instantly. Safe and client-side.",
  keywords: ["resize image in kb", "reduce image size in kb", "compress photo in kb", "image size reducer in kb"],
};

export default function ResizeImageInKbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      title="Resize Image in KB"
      subtitle="Reduce and compress your photo file size to target KB limits. Safe, local, browser-based optimization."
      pageSuffix="Resize Image in KB"
    />
  );
}
