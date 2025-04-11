import z from "zod";

export type authSectionProps = {
  register: boolean;
  onRegisterChange: (register: boolean) => void;
};

export const signInSchema = z.object({
  email: z.string().min(1, {
    message: "Email Wajib Diisi",
  }).email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password Wajib Diisi" }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Nama Wajib diisi" }),
    email: z.string().min(1, {
      message: "Email Wajib diisi"}).email({ message: "Email tidak valid" }),
    password: z.string().min(1, { message: "Password Wajib diisi" }).min(8, { message: "password tidak boleh kurang dari 8 karakter" }),
    confPassword: z
      .string()
      .min(1, { message: "Konfirmasi Password Wajib diisi" }).min(8, { message: "password tidak boleh kurang dari 8 karakter" })
  })
  .refine(val => val.password === val.confPassword, {
    path: ["confPassword"],
    message: "Konfirmasi Password tidak sama dengan Password",
  });