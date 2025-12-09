import { z } from "zod";

export type propsDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsDialogDelete = propsDialog & { roomId: string, kostId: string };

export const roomSchema = z.object({
  name: z.string().min(1, "Nama kamar tidak boleh kosong"),
  kostId: z.string().min(1, "Kost terkait tidak boleh kosong"),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Tipe Kamar wajib diisi" }),
  price: z.string().min(1, "Harga kamar harus diisi"),
  size: z
    .string()
    .min(1, { message: "Ukuran kamar wajib diisi" })
    .regex(/^\d+\s*x\s*\d+$/, {
      message:
        "Ukuran kamar harus dalam format {angka}x{angka} atau {angka} x {angka}",
    }),
  max_occupants: z
    .string()
    .min(1, { message: "Jumlah Maksimal penghuni harus ditentukan" }),
  deposit: z.string().optional(),
  featured_image: z.string().optional(),
  images: z.array(z.string()).optional(),
  private_facilies: z.array(z.string()),
});