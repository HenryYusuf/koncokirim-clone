import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phoneNumber: z.string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .regex(/^(08|\+628)\d{8,12}$/, "Format nomor WhatsApp tidak valid (Gunakan 08xx atau +628xx)"),
});

export const signInSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
