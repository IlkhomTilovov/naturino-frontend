import { z } from "zod";

export const productSchema = z.object({
  categoryId: z.string().min(1, "Kategoriya tanlanishi shart"),
  sku: z.string().min(1, "SKU kiritilishi shart"),
  name: z.string().min(1, "Nomi kiritilishi shart"),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Narx 0 dan katta bo'lishi kerak"),
  oldPrice: z.coerce.number().optional().nullable(),
  stockQuantity: z.coerce.number().int().min(0, "Qoldiq manfiy bo'lmasligi kerak"),
  weight: z.coerce.number().optional().nullable(),
  brand: z.string().optional(),
  ageGroup: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export type ProductFormSchema = z.infer<typeof productSchema>;
