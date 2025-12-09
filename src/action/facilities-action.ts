"use server";

import { facilitiesSchema } from "@/components/features/dashboard/facilities/facitity.constant";
import { db } from "@/db/drizzle";
import { facilities } from "@/db/schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const createFacility = async (
  values: z.infer<typeof facilitiesSchema>
) => {

  const result = facilitiesSchema.safeParse(values);

  if (result.error){
    return {
      success: false,
      message: "Ada Field Tidak Terisi!",
      errors: result.error.format().name?._errors,
    };
  }

  const data = { ...result.data, name: result.data.name.toLowerCase() }

  try {
    await db.insert(facilities).values(data);

    revalidateTag("facilities");

    return {
      success: true,
      message: "Fasilitas Berhasil Ditambah"
    }
  } catch (err) {
    console.log(err);

    if (err instanceof NeonDbError) {
      if(err.code == "23505"){
        return {
          success: false,
          message: "Fasilitas Sudah Ada",
        };
      };
    }

    return {
      success: false,
      message: "Gagal menambahkan fasilitas, hubungi admin",
    };
  }
};

export const updateFacilities = async (
  { id, values }: { id: number; values: z.infer<typeof facilitiesSchema> }
) => {
  const data = { ...values, name: values.name.toLowerCase() };

  try {
    await db.update(facilities).set(data).where(eq(facilities.id, id));

    revalidateTag("facilities");

    return {
      success: true,
      message: "Fasilitas Berhasil DiUpdate",
    };

  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Gagal menambahkan fasilitas, hubungi admin",
    };
  }
}

export const deleteFacilities = async (id: number) => {
  try {
    await db.delete(facilities).where(eq(facilities.id, id));

    revalidateTag("facilities");
  } catch (err) {
    console.log(err);
  }
}