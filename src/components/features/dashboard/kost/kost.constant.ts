import { z } from "zod";

// Aceh province ID
export const ACEH_PROVINCE_ID = '11'

// IDs for Banda Aceh and Aceh Besar
export const BANDA_ACEH_ID = '1171'
export const ACEH_BESAR_ID = '1106'

export type Province = {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
}

export type City = {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
}

export type District = {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
}

export type Village = {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
}

export type propsDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsDialogDelete = propsDialog & { id: string };

export const rules_placeholder = [
  "Dilarang membawa tamu menginap",
  "Dilarang merokok di dalam kamar",
  "Jam malam pukul 22.00",
  "Wajib menjaga kebersihan area bersama",
  "Dilarang membawa hewan peliharaan",
];

export const kostSchema = z.object({
  kost_name: z.string().min(1, { message: "Nama Kost Wajib Diisi" }),
  total_rooms: z.coerce.number().min(1, { message: "Total Ruang Wajib Diisi" }),
  available_rooms: z.coerce
    .number()
    .min(1, { message: "Ruang Tersedia Wajib Diisi" }),
  floor_level: z.coerce.number().min(1, { message: "Lantai Wajib Diisi" }),
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional(),
  gender: z.enum(["male", "female", "mix"], {
    required_error: "Jenis/gender kost wajib diisi",
  }),
  kost_description: z.string().min(1, { message: "Deskripsi Kost wajib diisi" }),
  kost_type: z.string().min(1, { message: "Tipe Kost wajib diisi" }),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  province: z.string().min(1, { message: "provinsi harus diisi" }),
  city: z.string().min(1, { message: "kabupaten/kota harus diisi" }),
  district: z.string().min(1, { message: "kecamatan harus diisi" }),
  village: z.string().min(1, { message: "desa harus diisi" }),
  latitude: z.coerce.number().min(1, { message: "Latitude harus diisi" }),
  longitude: z.coerce.number().min(1, { message: "longitude harus diisi" }),
  general_facilies: z.array(z.string()),
  private_facilies: z.array(z.string()),
  rules: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  isPublish: z.boolean(),
  room_name: z.string().optional(),
  room_type: z.string().min(1, { message: "Tipe Kamar wajib diisi" }),
  room_size: z
    .string()
    .min(1, { message: "Ukuran kamar wajib diisi" })
    .regex(/^\d+\s*x\s*\d+$/, {
      message:
        "Ukuran kamar harus dalam format {angka}x{angka} atau {angka} x {angka}",
    }),
  room_price: z.string().min(1, { message: "Harga wajib diisi" }),
  min_stay: z.string().min(1, { message: "Format bayar harus ditentukan" }),
  max_occupants: z
    .string()
    .min(1, { message: "Jumlah Maksimal penghuni harus ditentukan" }),
  deposit: z.string().optional(),
  featured_image: z.string().optional(),
  images: z.array(z.string()).optional()
});