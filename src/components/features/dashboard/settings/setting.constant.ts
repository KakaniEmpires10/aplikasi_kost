import { z } from "zod";

export const updateProfileSchema = z.object({
  profile_image: z.string().optional(),
  username: z.string().min(1, { message: "Username Harus diisi" }).optional(),
});

export const updatePasswordSchema = z
  .object({
    password_lama: z.string().min(1, { message: "Password Lama Wajib Diisi" }),
    password_baru: z.string().min(1, { message: "Password Baru Wajib Diisi" }),
    konfirmasi_password: z.string().min(1, { message: "Konfirmasi Password Wajib Diisi" }),
  })
  .refine(val => val.password_baru === val.konfirmasi_password, {
    path: ["konfirmasi_password"],
    message: "Konfirmasi Password tidak sama dengan Password",
  });