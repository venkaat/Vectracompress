import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Signature Resize Tool Online Free | ResizePixel Online",
  description: "Resize and crop digital signature images to standard wide ratios (3:1) for portal uploads. Secure, local, and instant.",
  keywords: ["signature resize tool", "crop signature online", "resize signature image online", "signature size compressor"],
};

export default function SignatureResizePage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={20}
      defaultCropRatio="3:1"
      title="Signature Image Resizer"
      subtitle="Frame your scanned signatures. Pre-locked to a 3:1 landscape aspect ratio. Sized for web forms."
      pageSuffix="Signature Resize"
      specialInstructions={[
        "Write your signature with a black pen on crisp white paper.",
        "Ensure good, high-contrast lighting before taking the photo.",
        "Crop borders tightly around the signature using our 3:1 bounding box.",
        "Output will automatically target low KB for form uploads."
      ]}
    />
  );
}
