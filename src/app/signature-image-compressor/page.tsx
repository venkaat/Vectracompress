import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Signature Image Compressor Online - Under 20KB | ResizePixel Online",
  description: "Resize and compress digital signature images under 20KB online for free. Adjust dimensions and crop to 3:1 landscape format locally.",
  keywords: ["signature image compressor", "compress signature online", "resize signature to 20kb", "signature size reducer"],
};

export default function SignaturePhotoPage() {
  const instructions = [
    "Write your signature on a clean white piece of paper using dark ink.",
    "Tapping the 'Crop & Scale' tab will load a 3:1 Wide crop box suited for signatures.",
    "Crop tightly to the boundaries of the text to cut out empty white space.",
    "Press 'Apply Crop' then keep the target limit preset under 20KB for easy form uploads."
  ];

  return (
    <CompressorWorkspace
      defaultTargetSizeKb={20}
      title="Signature Image Compressor"
      subtitle="Optimize and shrink your handwritten signature under 20KB. Standard 3:1 ratios enabled."
      defaultCropRatio="3:1"
      specialInstructions={instructions}
      pageSuffix="Signature Compressor"
    />
  );
}
