import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Facebook Cover Photo Resizer Online Free | ResizePixel Online",
  description: "Resize and format photos to the standard Facebook cover photo size of 820x312 pixels online for free. Clean local processing.",
  keywords: ["facebook cover photo resizer", "resize photo for facebook cover", "facebook cover dimension 820x312", "cover photo resizer"],
};

export default function FacebookCoverPhotoResizerPage() {
  return (
    <ResizeWorkspace
      defaultWidth={820}
      defaultHeight={312}
      title="Facebook Cover Photo Resizer"
      subtitle="Optimize and format your header graphics to exactly 820x312 pixels for profile background dimensions."
      pageSuffix="Facebook Cover Photo Resizer"
      specialInstructions={[
        "Standard cover dimensions: 820x312 pixels.",
        "Keep central elements focused so they scale properly on mobile layout."
      ]}
    />
  );
}
