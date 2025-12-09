"use server";

import { categoriesSchema } from "@/components/features/dashboard/categories/categories.constant";
import { db } from "@/db/drizzle";
import { propertyCategories } from "@/db/schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const createPropertyCategories = async (
  values: z.infer<typeof categoriesSchema>
) => {

  const result = categoriesSchema.safeParse(values);

  if (result.error){
    return {
      success: false,
      message: "Ada Field Tidak Terisi!",
      errors: result.error.format().name?._errors,
    };
  }

  const data = { ...result.data, name: result.data.name.toLowerCase() }

  try {
    await db.insert(propertyCategories).values(data);

    revalidateTag("property_categories");

    return {
      success: true,
      message: "Tipe/Kategori Berhasil Ditambah"
    }
  } catch (err) {
    console.log(err);

    if (err instanceof NeonDbError) {
      if(err.code == "23505"){
        return {
          success: false,
          message: "Tipe/Kategori Sudah Ada",
        };
      };
    }

    return {
      success: false,
      message: "Gagal menambahkan Tipe, hubungi admin",
    };
  }
};

export const updatePropertyCategories = async (
  { id, values }: { id: number; values: z.infer<typeof categoriesSchema> }
) => {
  const data = { ...values, name: values.name.toLowerCase() };

  try {
    await db.update(propertyCategories).set(data).where(eq(propertyCategories.id, id));

    revalidateTag("property_categories");

    return {
      success: true,
      message: "Tipe/kategori Berhasil DiUpdate",
    };

  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Gagal menambahkan tipe, hubungi admin",
    };
  }
}

export const deletePropertyCategories = async (id: number) => {
  try {
    await db.delete(propertyCategories).where(eq(propertyCategories.id, id));

    revalidateTag("property_categories");
  } catch (err) {
    console.log(err);
  }
}