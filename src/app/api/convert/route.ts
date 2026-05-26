import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const format = formData.get("format") as string | null;
    const qualityStr = formData.get("quality") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!format) {
      return NextResponse.json({ error: "No target format provided" }, { status: 400 });
    }

    const validFormats = ["jpeg", "png", "webp", "avif", "tiff"];
    if (!validFormats.includes(format)) {
      return NextResponse.json({ error: "Invalid target format" }, { status: 400 });
    }

    const quality = qualityStr ? parseInt(qualityStr, 10) : 80;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let sharpInstance = sharp(buffer);

    // Apply format-specific optimizations
    switch (format) {
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
        break;
      case "png":
        // For PNG, quality reduces colors (quantization) if supported, or standard compression
        sharpInstance = sharpInstance.png({ quality, compressionLevel: 8 });
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality });
        break;
      case "avif":
        sharpInstance = sharpInstance.avif({ quality, effort: 3 });
        break;
      case "tiff":
        sharpInstance = sharpInstance.tiff({ quality });
        break;
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename="converted.${format === "jpeg" ? "jpg" : format}"`,
      },
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: error.message || "Failed to convert image" }, { status: 500 });
  }
}
