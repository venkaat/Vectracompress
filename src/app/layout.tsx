import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraEdit | Premium Web-Based Image & Document Suite",
  description: "High-performance browser-based tools: Upscale, Compress, Background Remover, PDF Utilities, Cropper, and Blur/Sharpen powered by Fabric.js, Canvas and Sharp.",
  keywords: ["image upscaler", "image compressor", "background remover", "image editor", "pdf converter", "image to pdf", "pdf to image", "crop image", "blur image", "sharpen image"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-gray-100 font-sans selection:bg-brand-primary/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
