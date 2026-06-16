import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Passport Photo to 50KB Online Free | ResizePixel Online",
  description: "Compress and resize passport photos under 50KB online for free. Clean local processing, automatic 1:1 square crop aspect ratio.",
  keywords: ["passport photo to 50kb", "compress passport photo to 50kb", "resize passport photo to 50kb", "government passport photo size"],
};

export default function PassportPhotoTo50kbPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      defaultCropRatio="1:1"
      title="Passport Photo to 50KB"
      subtitle="Reduce passport photo file weight under 50KB. Complete local browser-based optimization."
      pageSuffix="Passport Photo to 50KB"
      specialInstructions={[
        "Use a plain white or off-white background.",
        "Align your face centered inside the 1:1 square crop box.",
        "Ensure neutral expressions and keep eyes open."
      ]}
    />
  );
}
