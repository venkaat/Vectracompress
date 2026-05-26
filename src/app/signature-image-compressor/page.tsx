import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Signature Image Compressor Online - Under 20KB | AuraCompress",
  description: "Compress signature image size under 20KB or 10KB online. Custom 3:1 wide crop ratio to remove margins. Ideal for online application forms.",
  keywords: ["signature image compressor", "compress signature under 20kb", "resize signature image online", "signature size reducer"],
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
