import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "LinkedIn Banner Resizer Online Free | ResizePixel Online",
  description: "Resize and optimize profile background covers to the recommended LinkedIn banner size of 1584x396 pixels. Fast, secure, and client-side.",
  keywords: ["linkedin banner resizer", "linkedin cover photo size 1584x396", "resize background photo for linkedin", "cover resizer"],
};

export default function LinkedinBannerResizerPage() {
  return (
    <ResizeWorkspace
      defaultWidth={1584}
      defaultHeight={396}
      title="LinkedIn Banner Resizer"
      subtitle="Optimize and format your professional background cover to exactly 1584x396 pixels."
      pageSuffix="LinkedIn Banner Resizer"
      specialInstructions={[
        "Standard LinkedIn background banner dimensions: 1584x396 pixels.",
        "Aspect ratio: 4:1.",
        "Ensure logos or text are offset from the left corner (where the profile picture overlays on desktop)."
      ]}
    />
  );
}
