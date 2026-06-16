import type { Metadata } from "next";
import CompressorWorkspace from "@/components/tools/CompressorWorkspace";

export const metadata: Metadata = {
  title: "Photo Resize for Government Exam Online Free | ResizePixel Online",
  description: "Crop, resize, and compress identity photos for government exams, civil services, and job application portals under 50KB. Safe, secure, and client-side.",
  keywords: ["photo for government exam", "exam photo size reducer", "compress exam photo", "resize passport size photo for application"],
};

export default function GovernmentExamPhotoPage() {
  return (
    <CompressorWorkspace
      defaultTargetSizeKb={50}
      defaultCropRatio="1:1"
      title="Exam Application Photo Resizer"
      subtitle="Optimize and compress application photos under 50KB for central, state, and academic exam portals."
      pageSuffix="Exam Photo Resizer"
      specialInstructions={[
        "Check portal requirements for height-width dimensions.",
        "Ensure signature or date stamp is clearly visible if required.",
        "Adjust crop boundaries to match head-and-shoulder alignment.",
        "File size is pre-configured to stay strictly below 50KB."
      ]}
    />
  );
}
