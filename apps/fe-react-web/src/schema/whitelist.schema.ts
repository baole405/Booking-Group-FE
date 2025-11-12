import z from "zod";

export const WhitelistSchema = z.object({
  id: z.union([z.number(), z.null(), z.undefined()]),
  email: z.string(),
  fullName: z.string(),
  studentCode: z.string().optional().nullable(),
  role: z.string(),
  semester: z
    .object({
      id: z.number(),
      name: z.string(),
      active: z.boolean(),
      isComplete: z.boolean().optional(),
    })
    .optional(),
  isActive: z.boolean(),
  createdAt: z.string().optional(),
});

export const ImportWhitelistSchema = z.object({
  semesterId: z.number(),
  role: z.string(),
  file: z.instanceof(File),
});

export const CheckEmailSchema = z.object({
  semesterId: z.number(),
  email: z.string().email("Email không hợp lệ"),
});

export const DeleteWhitelistSchema = z.object({
  semesterId: z.number(),
  role: z.string(),
});

export type TWhitelist = z.TypeOf<typeof WhitelistSchema>;
export type TImportWhitelist = z.TypeOf<typeof ImportWhitelistSchema>;
export type TCheckEmail = z.TypeOf<typeof CheckEmailSchema>;
export type TDeleteWhitelist = z.TypeOf<typeof DeleteWhitelistSchema>;
