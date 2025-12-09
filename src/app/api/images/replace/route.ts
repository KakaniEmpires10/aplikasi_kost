import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getPublicIdFromUrl } from "@/lib/image-uploader-client";

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
    // Batas ukuran untuk upload
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const url = formData.get("url") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak Ada file yang dikirimkan" },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran File melebihi batas (5MB)" },
        { status: 400 }
      );
    }

    // Dapatkan publicId dari URL
    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Cloudinary URL or publicId not found",
        },
        { status: 400 }
      );
    }

    // Convert file ke buffer
    const buffer = await bufferFromFormData(formData, "file");

    // Upload ke Cloudinary dengan overwrite
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          overwrite: true,
          invalidate: true,
        },
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
    console.error("Error replacing image in Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengubah gambar" },
      { status: 500 }
    );
  }
}
