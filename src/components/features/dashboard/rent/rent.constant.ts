import { z } from "zod";

export type propsDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsDialogDelete = propsDialog & { id: string };

export const rentSchema = z.object({
  name: z.string().min(1, "Nama Rumah tidak boleh kosong"),
  description: z.string().optional(),
  total_rooms: z.coerce
    .number()
    .min(1, { message: "Jumlah Kamar Harus Diisi" }),
  total_bathrooms: z.coerce
    .number()
    .min(1, { message: "Jumlah Kamar mandi Harus Diisi" }),
  price: z.string().min(1, "Harga kamar harus diisi"),
  size: z
    .string()
    .min(1, { message: "Ukuran kamar wajib diisi" })
    .regex(/^\d+\s*x\s*\d+$/, {
      message:
        "Ukuran kamar harus dalam format {angka}x{angka} atau {angka} x {angka}",
    }),
  floor_level: z.coerce
    .number()
    .min(1, { message: "Jumlah Lantai Wajib Diisi" }),
  type: z.string().min(1, { message: "Tipe rumah harus dipilih" }),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  province: z.string().min(1, { message: "provinsi harus diisi" }),
  city: z.string().min(1, { message: "kabupaten/kota harus diisi" }),
  district: z.string().min(1, { message: "kecamatan harus diisi" }),
  village: z.string().min(1, { message: "desa harus diisi" }),
  latitude: z.coerce.number().min(1, { message: "Latitude harus diisi" }),
  longitude: z.coerce.number().min(1, { message: "longitude harus diisi" }),
  min_stay: z.string().min(1, { message: "Format bayar harus ditentukan" }),
  gender: z.enum(["male", "female", "mix"], {
    required_error: "Jenis/gender kost wajib diisi",
  }),
  featured_image: z.string().optional(),
  images: z.array(z.string()).optional(),
  facilities: z.array(z.string()),
  isPublish: z.boolean(),
});