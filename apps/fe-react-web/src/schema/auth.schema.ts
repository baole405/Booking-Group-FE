import { z } from "zod";

// Request login thường
export const LoginSchema = z
  .object({
    email: z.string().min(1, { message: "Email không được bỏ trống" }).max(50, { message: "Email không được quá 50 ký tự" }),
    password: z.string().min(1, { message: "Mật khẩu không được bỏ trống" }).max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
  })
  .strict();

// Response login (áp dụng cho cả login thường và Google)
export const AuthResponseSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});

// Request login Google
export const GoogleLoginSchema = z
  .object({
    idToken: z.string().min(1, { message: "idToken là bắt buộc" }),
  })
  .strict();

// ---------------- Types ----------------
export type TLoginRequest = z.TypeOf<typeof LoginSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
export type TGoogleLoginRequest = z.TypeOf<typeof GoogleLoginSchema>;
