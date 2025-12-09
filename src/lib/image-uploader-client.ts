import { ImageUploadType, UploadedImage } from "./image-uploader";

// Fungsi client-side untuk upload ke Cloudinary via API route
export const uploadToCloudinaryClient = async (
  file: File,
  folder: string = "profile"
): Promise<ImageUploadType> => {
  try {
    // Buat FormData untuk kirim file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    // Kirim request ke API route
    const response = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        result: data.error || "Gagal Upload",
      };
    }

    return {
      success: true,
      result: data.result,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

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

// Fungsi client-side untuk replace gambar di Cloudinary via API route
export const replaceImageCloudinaryClient = async (
  file: File,
  url: string
): Promise<ImageUploadType> => {
  try {
    // Validasi URL
    if (!url || !getPublicIdFromUrl(url)) {
      return {
        success: false,
        error: "URL tidak valid atau publicId tidak ditemukan",
      };
    }

    // Buat FormData untuk kirim file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("url", url);

    // Kirim request ke API route
    const response = await fetch("/api/images/replace", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Replace failed",
      };
    }

    return {
      success: true,
      result: data.result,
    };
  } catch (error) {
    console.error("Error replacing image in Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// API untuk menghapus gambar dari Cloudinary
export const deleteFromCloudinaryClient = async (
  publicId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/images/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Failed to delete image",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Fungsi untuk rollback uploads jika terjadi error
export const rollbackUploadsClient = async (
  uploadedImages: UploadedImage[]
) => {
  try {
    for (const image of uploadedImages) {
      await deleteFromCloudinaryClient(image.publicId);
    }
    console.log(
      `Successfully rolled back ${uploadedImages.length} image uploads`
    );
  } catch (error) {
    console.error("Error during image upload rollback:", error);
  }
};
