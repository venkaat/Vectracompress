import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const factorStr = formData.get("factor") as string | null; // "2" or "4"
    const sharpenStr = formData.get("sharpen") as string | null; // "true" or "false"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const factor = factorStr ? parseInt(factorStr, 10) : 2;
    const applySharpen = sharpenStr === "true";

    if (factor !== 2 && factor !== 4) {
      return NextResponse.json({ error: "Invalid scaling factor. Only 2x and 4x are supported." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json({ error: "Could not read image dimensions." }, { status: 400 });
    }

    const newWidth = metadata.width * factor;
    const newHeight = metadata.height * factor;

    // Perform upscaling using Lanczos3 kernel
    sharpInstance = sharpInstance.resize({
      width: newWidth,
      height: newHeight,
      kernel: sharp.kernel.lanczos3,
    });

    // Optionally apply a gentle sharpening to keep edges extremely crisp after scaling
    if (applySharpen) {
      sharpInstance = sharpInstance.sharpen({
        sigma: 1.0,
        m1: 1.0,
        m2: 2.0,
      });
    }

    // Preserve the original format
    let contentType = "image/jpeg";
    let extension = "jpg";

    if (metadata.format === "png") {
      sharpInstance = sharpInstance.png({ compressionLevel: 9 });
      contentType = "image/png";
      extension = "png";
    } else if (metadata.format === "webp") {
      sharpInstance = sharpInstance.webp({ quality: 90 });
      contentType = "image/webp";
      extension = "webp";
    } else if (metadata.format === "avif") {
      sharpInstance = sharpInstance.avif({ quality: 85 });
      contentType = "image/avif";
      extension = "avif";
    } else {
      sharpInstance = sharpInstance.jpeg({ quality: 90, mozjpeg: true });
      contentType = "image/jpeg";
      extension = "jpg";
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="upscaled_${factor}x.${extension}"`,
      },
    });
  } catch (error: any) {
    console.error("Upscale error:", error);
    return NextResponse.json({ error: error.message || "Failed to upscale image" }, { status: 500 });
  }
}
