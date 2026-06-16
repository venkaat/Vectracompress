import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Facebook Cover Resizer Online Free | ResizePixel Online",
  description: "Resize and format photos to the standard Facebook desktop cover size of 820x312 pixels. Adjust height and width proportionally. Secure, local, and free.",
  keywords: ["facebook cover resizer", "make facebook cover photo online", "facebook cover size 820x312", "social resizer"],
};

export default function FacebookCoverResizerPage() {
  return (
    <ResizeWorkspace
      defaultWidth={820}
      defaultHeight={312}
      title="Facebook Cover Resizer"
      subtitle="Optimize and format your header graphics to exactly 820x312 pixels for desktop coverage."
      pageSuffix="Facebook Cover Resizer"
      specialInstructions={[
        "Standard Facebook cover dimensions: 820x312 pixels.",
        "Ensure critical content stays centered to display cleanly on mobile screens."
      ]}
    />
  );
}
