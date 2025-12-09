import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "Public ID is required" },
        { status: 400 }
      );
    }

    // Hapus dari Cloudinary
    const result = await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cloudinary.uploader.destroy(publicId, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve("berhasil menghapus gambar");
        }
      });
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
