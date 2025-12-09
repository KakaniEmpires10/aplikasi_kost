import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Fungsi utilitas untuk memproses formData menjadi buffer
const bufferFromFormData = async (formData: FormData, fieldName: string) => {
  const file = formData.get(fieldName) as File;

  if (!file) {
    throw new Error(`File not found in field: ${fieldName}`);
  }

  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export async function POST(request: NextRequest) {
  try {
    // Batas ukuran untuk upload (opsional, sesuaikan kebutuhan)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "default";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validasi ukuran file (opsional)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds limit (5MB)" },
        { status: 400 }
      );
    }

    // Convert file ke buffer
    const buffer = await bufferFromFormData(formData, "file");

    // Upload ke Cloudinary menggunakan Promise
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Kirim buffer ke upload stream
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
