import type { Metadata } from "next";
import CropWorkspace from "@/components/tools/CropWorkspace";

export const metadata: Metadata = {
  title: "Crop Image Online Free | Interactive Photo Cropper - ResizePixel Online",
  description: "Crop your images online to custom dimensions or standard aspect ratios. Squeeze spatial pixels securely inside your web browser. Fast, free, and local.",
  keywords: ["crop image online", "image cropper", "interactive crop tool", "cut image borders"],
};

export default function CropPage() {
  return (
    <CropWorkspace />
  );
}
