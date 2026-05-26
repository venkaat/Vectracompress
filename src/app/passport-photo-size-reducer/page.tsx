import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Passport Photo Size Reducer Online - Under 50KB | AuraCompress",
  description: "Reduce passport photo size under 50KB or 20KB online. Predefined 1:1 square crop box and specific alignment guidelines for official forms. Secure and private.",
  keywords: ["passport photo size reducer", "compress passport photo to 50kb", "resize passport photo online", "passport size photo compressor"],
};

export default function PassportPhotoPage() {
  const instructions = [
    "Ensure your face is fully centered, straight, and looking directly at the lens.",
    "Make sure your background is solid white or light-colored, without shadows.",
    "Launch the Crop tab and use the 1:1 Square crop box (pre-selected standard) to frame your face.",
    "Keep the final file target preset under 50KB (pre-selected requirement for most forms)."
  ];

  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      title="Passport Photo Size Reducer"
      subtitle="Format and compress your official photo under 50KB. Complete with standard 1:1 ratios."
      defaultCropRatio="1:1"
      specialInstructions={instructions}
      pageSuffix="Passport Photo Reducer"
    />
  );
}
