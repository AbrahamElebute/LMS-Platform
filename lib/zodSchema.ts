import { z } from "zod";

export const CourseLevel = ["Beginner", "Intermediate", "Advanced"] as const;
export const CourseStatus = ["Draft", "Published", "Archied"] as const;
export const CourseCategory = [
  "Technology",
  "Business",
  "Arts",
  "Science",
  "Health",
  "Languages",
  "Personal Development",
  "Marketing",
  "Finance",
  "Education",
] as const;

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at least most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),

  fileKey: z.string().min(1, { message: "Thumbnail is required" }),
  price: z.coerce.number().min(1),

  duration: z.string().min(1),
  level: z.enum(CourseLevel),

  category: z.enum(CourseCategory),
  smallDescription: z.string().min(3).max(200),
  slug: z.string().min(3),

  status: z.enum(CourseStatus),
});

export { formSchema, courseSchema };

export type courseSchemaType = z.infer<typeof courseSchema>;
