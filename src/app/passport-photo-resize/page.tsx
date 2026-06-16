import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Passport Photo Resize Online Free | ResizePixel Online",
  description: "Resize and crop passport photos online to the official 1:1 aspect ratio. Maintain high fidelity under government size specifications. 100% private.",
  keywords: ["passport photo resize", "crop passport photo", "resize passport size photo online", "passport photo size reducer"],
};

export default function PassportPhotoResizePage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      defaultCropRatio="1:1"
      title="Passport Photo Resize Tool"
      subtitle="Frame and format your passport photos. Pre-locked to a 1:1 aspect ratio. Secure and local."
      pageSuffix="Passport Photo Resize"
      specialInstructions={[
        "Use a clear background (plain white or off-white).",
        "Keep your head centered and look straight at the camera.",
        "Maintain a neutral expression, eyes fully visible.",
        "Crop your face to occupy between 50% to 70% of the square frame."
      ]}
    />
  );
}
