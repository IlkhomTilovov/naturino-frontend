import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email kiritilishi shart").email("Email noto'g'ri"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
