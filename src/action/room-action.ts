"use server";

import { roomSchema } from "@/components/features/dashboard/kost/room.constant";
import { db } from "@/db/drizzle";
import { kostRooms, kosts, roomFacilities, roomImages } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createRoom = async (data: z.infer<typeof roomSchema>) => {
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
      name,
      kostId,
      description,
      type,
      price,
      size,
      max_occupants,
      deposit,
      featured_image,
      images,
      private_facilies,
    } = data;

    const data_jumlah = await db.query.kosts.findFirst({
        columns: {
            availableRooms: true,
            totalRooms: true
        },
        where: eq(kosts.id, kostId)
    })

    const dataInsert = {
      kostId: kostId,
      name: name,
      description: description,
      price: price,
      size: size,
      maxOccupants: Number(max_occupants),
      securityDeposit: deposit,
      isAvailable: true,
      categoryId: Number(type),
    };

    return await db.transaction(async tx => {
      try {
        const roomData = await tx
          .insert(kostRooms)
          .values(dataInsert)
          .returning({ roomId: kostRooms.id });

        const roomId = roomData[0].roomId;

        // 2. Insert data general facilities
        if (private_facilies && private_facilies.length > 0) {
          const roomFacilitiesData = private_facilies.map(facilityId => ({
            roomId,
            facilityId: Number(facilityId),
          }));

          await tx.insert(roomFacilities).values(roomFacilitiesData).execute();
        }

        // 3. Insert room featured image if exist
        if (featured_image) {
          const roomFeaturedImage = {
            roomId,
            url: featured_image!,
            isFeatured: true,
            sortOrder: 0,
          };

          await tx.insert(roomImages).values(roomFeaturedImage).execute();
        }

        // 4. Insert gambar kamar if exist
        if (images && images.length > 0) {
          const roomImagesData = images.map((image, index) => ({
            roomId,
            url: image,
            sortOrder: index + 1,
          }));

          await tx.insert(roomImages).values(roomImagesData).execute();
        }

        if (data_jumlah && typeof data_jumlah.availableRooms === "number" && typeof data_jumlah.totalRooms === "number") {
          await tx.update(kosts)
            .set({ availableRooms: data_jumlah.availableRooms + 1, totalRooms: data_jumlah.totalRooms + 1 })
            .where(eq(kosts.id, kostId));
        } else {
          throw new Error("Data jumlah kamar tidak ditemukan atau tidak valid");
        }

        return {
          success: true,
          message: "Kamar Berhasil Dibuat",
        };
      } catch (err) {
        console.log(err);

        return {
          success: false,
          message: "Kamar Gagal Dibuat",
        };
      }
    });
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat menyimpan data. Silakan coba lagi atau hubungi administrator.",
    };
  } finally {
    revalidateTag("kosts");
    revalidateTag("rooms");
  }
};

export const deleteRoom = async ({
  kostId,
  roomId,
}: {
  roomId: string;
  kostId: string;
}) => {
  // Early validation checks
  if (!kostId) {
    return {
      success: false,
      message: "ID Kost Terkait tidak ditemukan",
    };
  }

  if (!roomId) {
    return {
      success: false,
      message: "ID Ruangan tidak ditemukan",
    };
  }

  try {
    // Fetch current room counts
    const kostData = await db.query.kosts.findFirst({
      columns: {
        availableRooms: true,
        totalRooms: true,
      },
      where: eq(kosts.id, kostId),
    });

    // Validate kost exists and has valid room counts
    if (!kostData) {
      return {
        success: false,
        message: "Data Kost tidak ditemukan",
      };
    }

    if (
      typeof kostData.availableRooms !== "number" ||
      typeof kostData.totalRooms !== "number"
    ) {
      return {
        success: false,
        message: "Data Jumlah Kamar Tidak Valid",
      };
    }

    // Validate room counts before deletion
    if (kostData.totalRooms <= 0) {
      return {
        success: false,
        message: "Tidak ada kamar yang dapat dihapus",
      };
    }

    // Check if room exists before attempting deletion
    const roomExists = await db.query.kostRooms.findFirst({
      columns: { id: true },
      where: eq(kostRooms.id, roomId),
    });

    if (!roomExists) {
      return {
        success: false,
        message: "Kamar tidak ditemukan",
      };
    }

    // Update Jumlah Ruangan Kost
    await db
      .update(kosts)
      .set({
        availableRooms: Math.max(0, kostData.availableRooms - 1),
        totalRooms: kostData.totalRooms - 1,
      })
      .where(eq(kosts.id, kostId));

    // Delete Kamar
    await db.delete(kostRooms).where(eq(kostRooms.id, roomId));

    revalidateTag("kosts");
    revalidateTag("rooms");

    return {
      success: true,
      message: "Kamar berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting room:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus kamar",
    };
  }
};