import { KostCategory } from "@/db/schema";
import { z } from "zod";

export type propsDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsDialogDelete = propsDialog & { id: number }
export type propsDialogInsert = propsDialog & { data?: KostCategory }

export const categoriesSchema = z.object({
  description: z.string().min(1, { message: "Deskripsi Wajib DiPilih" }),
  name: z.string().min(1, { message: "Nama Icon Wajib Diisi" }),
  type: z.string().min(1, { message: "Tipe Harus Wajib Diisi" })
});