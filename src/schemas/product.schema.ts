import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "상품명은 2자 이상 입력해주세요")
    .max(50, "상품명은 50자 이하로 입력해주세요"),

  price: z
    .number({ error: "가격을 입력해주세요" })
    .int("가격은 정수로 입력해주세요")
    .positive("가격은 0원보다 커야 합니다"),

  stock: z
    .number({ error: "재고를 입력해주세요" })
    .int("재고는 정수로 입력해주세요")
    .min(0, "재고는 0 이상이어야 합니다"),

  category: z.string().max(20, "카테고리는 20자 이하로 입력해주세요").optional(),

  description: z.string().max(500, "설명은 500자 이하로 입력해주세요").optional(),

  imageUrl: z
    .string()
    .refine(
      (val) => val === "" || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
      "이미지 경로(/images/...)나 URL(https://...)을 입력해주세요",
    )
    .optional()
    .or(z.literal("")), // 빈 문자열도 허용 (입력 안 함)
});

export type ProductFormData = z.infer<typeof productSchema>;
