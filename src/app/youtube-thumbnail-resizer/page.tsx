import type { Metadata } from "next";
import ResizeWorkspace from "@/components/tools/ResizeWorkspace";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Resizer Online Free | ResizePixel Online",
  description: "Resize and format custom video thumbnails to the recommended 1280x720 pixels (16:9 aspect ratio) for HD displays. Safe and secure.",
  keywords: ["youtube thumbnail resizer", "resize youtube thumbnail 1280x720", "make youtube thumbnail 720p", "thumbnail resizer online"],
};

export default function YoutubeThumbnailResizerPage() {
  return (
    <ResizeWorkspace
      defaultWidth={1280}
      defaultHeight={720}
      title="YouTube Thumbnail Resizer"
      subtitle="Format your custom video thumbnails to the recommended YouTube standard of 1280x720 pixels (720p)."
      pageSuffix="YouTube Thumbnail Resizer"
      specialInstructions={[
        "Official dimensions: 1280x720 pixels (minimum width of 640 pixels).",
        "Aspect ratio should remain 16:9 for perfect player layout.",
        "Ensure file size remains under 2MB for upload acceptance."
      ]}
    />
  );
}
