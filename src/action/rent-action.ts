"use server";

import { rentSchema } from "@/components/features/dashboard/rent/rent.constant";
import { db } from "@/db/drizzle";
import { rentFacilities, rentImages, rents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/image-uploader";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createRent = async (values: z.infer<typeof rentSchema>) => {
  const sessionData = await auth.api.getSession({ headers: await headers() });

  if (!sessionData) {
    redirect(
      "/authentication?message=Session%20tidak%20ditemukan,%20silahkan%20login%20kembali"
    );
  }

  if (!sessionData.user) {
    redirect(
      "/authentication?message=User%20tidak%20ditemukan,%20silahkan%20mendaftar%20dulu"
    );
  }

  const {
    address,
    province,
    city,
    district,
    village,
    facilities,
    isPublish,
    latitude,
    longitude,
    name,
    price,
    size,
    total_bathrooms,
    total_rooms,
    type,
    description,
    featured_image,
    images,
    floor_level,
    min_stay,
    gender,
  } = values;

  if (!featured_image)
    return { success: false, message: "Gambar utama Rumah Sewa wajib diisi" };
  if (images && images.length === 0)
    return { success: false, message: "Gambar Rumah Sewa wajib diisi" };

  try {
    const rentData = await db
      .insert(rents)
      .values({
        ownerId: sessionData.user.id,
        name: name,
        address: address,
        description: description ? description : "",
        totalRooms: total_rooms,
        totalBathrooms: total_bathrooms,
        floorLevel: floor_level,
        provinceId: province,
        regencyId: city,
        districtId: district,
        villageId: village,
        latitude:
          latitude !== undefined && latitude !== null ? String(latitude) : null,
        longitude:
          longitude !== undefined && longitude !== null
            ? String(longitude)
            : null,
        categoryId: Number(type),
        price: price,
        isAvailable: true,
        isPublish: isPublish,
        size: size,
        checkInTime: "00.00",
        checkOutTime: "00.00",
        minStayDuration: Number(min_stay),
        gender: gender,
      })
      .returning({ rentId: rents.id });

    const rentId = rentData[0].rentId;

    // 2. Insert data facilities
    if (facilities && facilities.length > 0) {
      const rentFacilitiesData = facilities.map(facilityId => ({
        rentId,
        facilityId: Number(facilityId),
      }));

      await db.insert(rentFacilities).values(rentFacilitiesData).execute();
    }

    // 3. Insert rent featured image
    const rentFeaturedImage = {
      rentId,
      url: featured_image,
      isFeatured: true,
      sortOrder: 0,
    };

    await db.insert(rentImages).values(rentFeaturedImage).execute();

    // 4. Insert gambar rent
    if (images && images.length > 0) {
      const rentImagesData = images.map((image, index) => ({
        rentId,
        url: image,
        sortOrder: index + 1,
      }));

      await db.insert(rentImages).values(rentImagesData).execute();
    }

    return {
      success: true,
      message: "Rumah Sewa berhasil dibuat",
    }
  } catch (err) {
    console.error("Error saat membuat Rumah:", err);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat menyimpan data. Silakan coba lagi atau hubungi administrator.",
    };
  }
};

export const deleteRent = async (id: string) => {
  const Images = await db.query.rentImages.findMany({
    columns: { url: true },
    where: eq(rentImages.rentId, id),
  });

  for (let i = 0; i < Images.length; i++) {
    const imagePublicId = getPublicIdFromUrl(Images[i].url);

    if (imagePublicId == null) {
      return { success: false, message: "ada url yang tidak terbaca" };
    }

    const imageDeleted = await deleteFromCloudinary(imagePublicId as string);

    if (!imageDeleted.success) {
      return { success: false, message: "gagal menghapus salah satu gambar" };
    }
  }

  try {
    await db.delete(rents).where(eq(rents.id, id));

    revalidateTag("rents");
  } catch (err) {
    console.log(err);
  }
}