import { z } from "zod";

export const LoginSchema = z
  .object({
    email: z.string().min(1, { message: "Email không được bỏ trống" }).max(50, { message: "Email không được quá 50 ký tự" }),
    password: z.string().min(1, { message: "Mật khẩu không được bỏ trống" }).max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
  })
  .strict();

export const AuthResponseSchema = z.object({
  tokenType: z.string(),
  id: z.string(),
  role: z.string(),
  username: z.string(),
  token: z.string(),
  refresh_token: z.string(),
});

export type TLoginRequest = z.TypeOf<typeof LoginSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
