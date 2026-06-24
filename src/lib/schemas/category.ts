import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Nomi (UZ) kiritilishi shart"),
  nameRu: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
  metaTitleUz: z.string().max(60, "Meta title 60 belgidan oshmasligi kerak").optional(),
  metaTitleRu: z.string().max(60, "Meta title 60 belgidan oshmasligi kerak").optional(),
  metaDescriptionUz: z.string().max(160, "Meta description 160 belgidan oshmasligi kerak").optional(),
  metaDescriptionRu: z.string().max(160, "Meta description 160 belgidan oshmasligi kerak").optional(),
  metaKeywords: z.string().optional(),
  isIndexable: z.boolean(),
  isFollow: z.boolean(),
});

export type CategoryFormSchema = z.infer<typeof categorySchema>;
