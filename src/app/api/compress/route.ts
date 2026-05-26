import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetSizeKbStr = formData.get("targetSizeKb") as string | null;
    const scalePercentStr = formData.get("scalePercent") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const targetSizeBytes = targetSizeKbStr ? parseInt(targetSizeKbStr, 10) * 1024 : null;
    const scalePercent = scalePercentStr ? parseInt(scalePercentStr, 10) : 100;

    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    const originalFormat = metadata.format;

    let outputBuffer: any = buffer;
    let format = originalFormat === "png" ? "png" : originalFormat === "webp" ? "webp" : "jpeg";
    let contentType = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
    let extension = format === "png" ? "png" : format === "webp" ? "webp" : "jpg";

    const userScale = scalePercent / 100;

    if (targetSizeBytes && buffer.length > targetSizeBytes) {
      // ITERATIVE COMPRESSION ALGORITHM
      let lowQuality = 10;
      let highQuality = 95;
      let bestBuffer: Buffer | null = null;
      let algoScale = 1.0;

      // Iteratively adjust scale and quality
      for (let pass = 0; pass < 2; pass++) {
        // Pass 0: Try to search using Quality
        // Pass 1: Apply dynamic downscaling and search again
        lowQuality = 10;
        highQuality = pass === 0 ? 95 : 60;
        
        for (let i = 0; i < 5; i++) {
          const currentQuality = Math.round((lowQuality + highQuality) / 2);
          let instance = sharp(buffer);
          
          const combinedScale = userScale * algoScale;
          if (combinedScale < 1.0 && metadata.width) {
            instance = instance.resize({ width: Math.round(metadata.width * combinedScale), withoutEnlargement: true });
          }

          if (format === "png") {
            instance = instance.png({ quality: currentQuality, compressionLevel: 8 });
          } else if (format === "webp") {
            instance = instance.webp({ quality: currentQuality });
          } else {
            instance = instance.jpeg({ quality: currentQuality, mozjpeg: true });
          }

          const currentBuffer = await instance.toBuffer();

          if (currentBuffer.length <= targetSizeBytes) {
            bestBuffer = currentBuffer;
            lowQuality = currentQuality + 1; // Try to get higher quality
          } else {
            highQuality = currentQuality - 1; // Too big, lower quality
          }
        }

        // If we found a buffer that fits, break
        if (bestBuffer) {
          outputBuffer = bestBuffer;
          break;
        }

        // If even at lowest quality it's too big, downscale image by sizing ratio and retry
        if (pass === 0) {
          // Estimate scale ratio based on size mismatch
          const sampleInstance = sharp(buffer).jpeg({ quality: 10 });
          if (userScale < 1.0 && metadata.width) {
            sampleInstance.resize({ width: Math.round(metadata.width * userScale), withoutEnlargement: true });
          }
          const sampleBuffer = await sampleInstance.toBuffer();
          algoScale = Math.min(0.9, Math.sqrt(targetSizeBytes / sampleBuffer.length));
        }
      }

      // Final fallback if still larger: force hard JPEG compression at low quality and scale
      if (!bestBuffer) {
        let instance = sharp(buffer);
        const forceScale = Math.min(0.5, userScale * 0.5);
        if (metadata.width) {
          instance = instance.resize({ width: Math.round(metadata.width * forceScale), withoutEnlargement: true });
        }
        if (format === "png") {
          instance = instance.png({ quality: 10, compressionLevel: 9 });
        } else if (format === "webp") {
          instance = instance.webp({ quality: 10 });
        } else {
          instance = instance.jpeg({ quality: 10, mozjpeg: true });
        }
        outputBuffer = await instance.toBuffer();
      }
    } else {
      // Standard default optimization if no target size requested or fits
      let instance = sharp(buffer);
      if (userScale < 1.0 && metadata.width) {
        instance = instance.resize({ width: Math.round(metadata.width * userScale), withoutEnlargement: true });
      }
      if (format === "png") {
        instance = instance.png({ quality: 80, compressionLevel: 8 });
      } else if (format === "webp") {
        instance = instance.webp({ quality: 80 });
      } else {
        instance = instance.jpeg({ quality: 80, mozjpeg: true });
      }
      outputBuffer = await instance.toBuffer();
    }

    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="optimized.${extension}"`,
        "X-Original-Size": buffer.length.toString(),
        "X-Compressed-Size": outputBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Compression error:", error);
    return NextResponse.json({ error: error.message || "Failed to compress image" }, { status: 500 });
  }
}
