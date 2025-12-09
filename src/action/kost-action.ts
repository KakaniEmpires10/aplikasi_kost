"use server";

import { kostSchema } from "@/components/features/dashboard/kost/kost.constant";
import { db } from "@/db/drizzle";
import {
  kostFacilities,
  kostImages,
  kostRooms,
  kosts,
  roomFacilities,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/image-uploader";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createKost = async (data: z.infer<typeof kostSchema>) => {
  try {
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
      kost_name,
      kost_type,
      total_rooms,
      available_rooms,
      address,
      floor_level,
      gender,
      kost_description,
      city,
      province,
      district,
      general_facilies,
      latitude,
      longitude,
      check_in_time,
      check_out_time,
      featured_image,
      images,
      rules,
      private_facilies,
      max_occupants,
      isPublish,
      min_stay,
      room_price,
      room_size,
      room_type,
      deposit,
      room_name,
      village
    } = data;

    // Validate data
    if (!featured_image)
      return { success: false, message: "Gambar utama kost wajib diisi" };
    if (images && images.length === 0)
      return { success: false, message: "Gambar kost wajib diisi" };

    // Gunakan transaksi untuk memastikan semua operasi DB berhasil atau gagal bersama
    return await db.transaction(async tx => {
      console.log("masuk ke transaksi");
      try {
        // 1. Insert data kost
        const kostData = await tx
          .insert(kosts)
          .values({
            ownerId: sessionData.user.id,
            name: kost_name,
            description: kost_description,
            availableRooms: available_rooms,
            totalRooms: total_rooms,
            address: address,
            floorLevel: floor_level,
            regencyId: city,
            provinceId: province,
            districtId: district,
            villageId: village,
            categoryId: Number(kost_type),
            checkInTime: check_in_time,
            checkOutTime: check_out_time,
            gender: gender,
            latitude:
              latitude !== undefined && latitude !== null
                ? String(latitude)
                : null,
            longitude:
              longitude !== undefined && longitude !== null
                ? String(longitude)
                : null,
            isAvailable: true,
            minStayDuration: Number(min_stay),
            rules: rules ? rules.map(rule => rule.value) : [],
            isPublish: isPublish,
          })
          .returning({ kostId: kosts.id });
          console.log("berhasil insert kost");
        const kostId = kostData[0].kostId;

        // 2. Insert data general facilities
        if (general_facilies && general_facilies.length > 0) {
          const kostFacilitiesData = general_facilies.map(facilityId => ({
            kostId,
            facilityId: Number(facilityId),
          }));

          await tx.insert(kostFacilities).values(kostFacilitiesData).execute();
        }
        console.log("berhasil insert kost facilities");
        // 3. Insert kost featured image
        const kostFeaturedImage = {
          kostId,
          url: featured_image,
          isFeatured: true,
          sortOrder: 0,
        };

        await tx.insert(kostImages).values(kostFeaturedImage).execute();
        console.log("berhasil insert kost featured image");
        // 4. Insert gambar kost
        if (images && images.length > 0) {
          const kostImagesData = images.map((image, index) => ({
            kostId,
            url: image,
            sortOrder: index + 1,
          }));

          await tx.insert(kostImages).values(kostImagesData).execute();
        }
        console.log("berhasil insert kost images");
        // 5. Automatically create room based on total room and available room
        const roomsInsert = [];
        let roomsData: { roomsId: string }[] = [];
        const unavailableCount = total_rooms - available_rooms;
        const name = room_name ? room_name : "Kamar";

        for (let i = 0; i < total_rooms; i++) {
          roomsInsert.push({
            kostId,
            name: `${name} ${i + 1}`, // Beri nama default
            description: kost_description, // Gunakan deskripsi kost sebagai default
            categoryId: Number(room_type), // Gunakan tipe kost sebagai default
            size: room_size,
            price: room_price,
            securityDeposit: deposit || null,
            isAvailable: i >= unavailableCount, // Sesuaikan dengan jumlah kamar tersedia
            maxOccupants: Number(max_occupants),
          });
        }

        if (roomsInsert.length > 0) {
          roomsData = await tx
            .insert(kostRooms)
            .values(roomsInsert)
            .returning({ roomsId: kostRooms.id });
        }
        console.log("berhasil insert kost rooms");
        const rooms_id = roomsData.map(room => room.roomsId);

        // 6. Insert private facilities untuk setiap kamar
        if (
          private_facilies &&
          private_facilies.length > 0 &&
          rooms_id.length > 0
        ) {
          // Buat array untuk menyimpan semua fasilitas kamar yang akan diinsert
          const roomFacilitiesData = [];

          // Untuk setiap kamar, tambahkan semua fasilitas private
          for (const roomId of rooms_id) {
            // Tambahkan setiap fasilitas private ke array
            for (const facilityId of private_facilies) {
              roomFacilitiesData.push({
                roomId,
                facilityId: Number(facilityId),
              });
            }
          }
          console.log("berhasil membuat data room facilities");
          // Insert semua fasilitas kamar sekaligus
          if (roomFacilitiesData.length > 0) {
            await tx
              .insert(roomFacilities)
              .values(roomFacilitiesData)
              .execute();
          }
        }

        // Jika semua operasi dalam transaksi berhasil, transaksi akan di-commit otomatis
        // dan kita mengembalikan hasil sukses
        return {
          success: true,
          message: "Data Kost berhasil ditambahkan",
        };
      } catch (error) {
        // Jika terjadi error, transaksi akan di-rollback otomatis
        console.error("Error dalam transaksi:", error);
        // Kita melempar error lagi agar bisa ditangkap oleh catch di luar
        throw error;
      }
    });
  } catch (error) {
    // Penanganan error global
    console.error("Error saat membuat kost:", error);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat menyimpan data. Silakan coba lagi atau hubungi administrator.",
    };
  } finally {
    // Revalidasi data cache terlepas apakah transaksi berhasil atau gagal
    // Ini aman dilakukan karena jika transaksi gagal, tidak ada data baru yang perlu direvalidasi
    revalidateTag("kosts");
    revalidateTag("rooms");
  }
};

export const deleteKost = async (id: string) => {
  const Images = await db.query.kostImages.findMany({
    columns: { url: true },
    where: eq(kostImages.kostId, id),
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
    await db.delete(kosts).where(eq(kosts.id, id));

    revalidateTag("kosts");
  } catch (err) {
    console.log(err);
  }
};

export const updateName = async (id: string, value: string) => {
  if (!id) {
    return { success: false, message: "Id Tidak Ditemukan" };
  }

  try {
    await db.update(kosts).set({ name: value }).where(eq(kosts.id, id));

    revalidateTag("kosts");

    return {
      success: true,
      message: "Nama Kost Berhasil Diubah",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Nama Gagal Diubah",
    };
  }
};

export const updateGender = async (id: string, value: string) => {
  if (!id) {
    return { success: false, message: "Id Tidak Ditemukan" };
  }

  try {
    await db.update(kosts).set({ gender: value }).where(eq(kosts.id, id));

    revalidateTag("kosts");

    return {
      success: true,
      message: "Gender Kost Berhasil Diubah",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Gender Gagal Diubah",
    };
  }
};

export const updateCategory = async (id: string, value: number) => {
  if (!id) {
    return { success: false, message: "Id Tidak Ditemukan" };
  }

  try {
    await db.update(kosts).set({ categoryId: value }).where(eq(kosts.id, id));

    revalidateTag("kosts");

    return {
      success: true,
      message: "Kategori Kost Berhasil Diubah",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Kategori Gagal Diubah",
    };
  }
};

export const updateFloor = async (id: string, value: number) => {
  if (!id) {
    return { success: false, message: "Id Tidak Ditemukan" };
  }

  try {
    await db.update(kosts).set({ floorLevel: value }).where(eq(kosts.id, id));

    revalidateTag("kosts");

    return {
      success: true,
      message: "Jumlah Lantai Kost Berhasil Diubah",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Jumlah Lantai Gagal Diubah",
    };
  }
};

export const updateMinStay = async (id: string, value: number) => {
  if (!id) {
    return { success: false, message: "Id Tidak Ditemukan" };
  }

  try {
    await db
      .update(kosts)
      .set({ minStayDuration: value })
      .where(eq(kosts.id, id));

    revalidateTag("kosts");

    return {
      success: true,
      message: "Format Pembayaran Kost Berhasil Diubah",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Format Pembayaran Gagal Diubah",
    };
  }
};

export const updateStatus = async (id: string, value: boolean) => {
  if (!id) {
    return { success: false, message: "Id Tidak Ditemukan" };
  }

  try {
    await db.update(kosts).set({ isPublish: value }).where(eq(kosts.id, id));

    revalidateTag("kosts");

    return {
      success: true,
      message: "Status Kost Berhasil Diubah",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Status Gagal Diubah",
    };
  }
};
