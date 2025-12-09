import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary";

export type UploadedImage = {
  url: string;
  publicId: string;
}

export type ImageUploadType = {
  success: boolean;
  result?: UploadApiResponse | UploadApiErrorResponse | undefined;
  error?: Error | string
};

export const uploadToCloudinary = async (img: File) => {
  const arrayBuffer = await img.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const res = await new Promise<ImageUploadType>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "settings" }, function (error, result) {
        if (error) {
          reject({ success: false, result: error.message });
          return;
        }
        resolve({ success: true, result: result });
      })
      .end(buffer);
  });

  return res;
};

export const replaceImageCloudinary = async (img: File, url: string) => {
  const arrayBuffer = await img.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const publicId = getPublicIdFromUrl(url);

  if (!publicId) {
    return { success: false, result: "publicId tidak ditemukan" };
  }

  const res = await new Promise<ImageUploadType>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: publicId, overwrite: true, invalidate: true },
        function (error, result) {
          if (error) {
            reject({ success: false, result: error.message });
            return;
          }
          resolve({ success: true, result: result });
        }
      )
      .end(buffer);
  });

  return res;
}

// Dapatkan public ID dari URL Cloudinary
export const getPublicIdFromUrl = (url: string): string | null => {
  // Pola URL Cloudinary: https://res.cloudinary.com/{cloudName}/image/upload/v{version}/{folder}/{publicId}.{format}
  const regex = /\/v\d+\/(?:([^/]+)\/)?([^/.]+)(?:\.[^/.]+)?$/;
  const match = url.match(regex);
  
  if (match) {
    // Jika ada folder, gabungkan folder/publicId
    if (match[1]) {
      return `${match[1]}/${match[2]}`;
    }
    // Jika tidak ada folder, kembalikan hanya publicId
    return match[2];
  }
  
  return null;
};

export const deleteFromCloudinary = async (publicId: string) => {
  const res = await new Promise<{ success: boolean; result: string }>(
    (resolve, reject) => {
      cloudinary.uploader.destroy(publicId, function (error) {
        if (error) {
          reject({ success: false, result: "gagal menghapus cloudinary" });
          return;
        }
        resolve({ success: true, result: "ok" });
      });
    }
  );

  return res;
};

export const rollbackUploads = async(uploadedImages: UploadedImage[]) => {
  try {
    for (const image of uploadedImages) {
      await deleteFromCloudinary(image.publicId);
    }
    console.log(
      `Successfully rolled back ${uploadedImages.length} image uploads`
    );
  } catch (error) {
    console.error("Error during image upload rollback:", error);
  }
}