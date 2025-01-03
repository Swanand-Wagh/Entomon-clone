import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  coverImage: z.string().nullable(),
  categories: z.tuple([z.string()]).or(z.array(z.string())),
  isPaid: z.boolean(),
  content: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const updateBlogSchema = z.object({
  blogId: z.string(),
  title: z.string().min(1).optional(),
  coverImage: z.string().optional(),
  categories: z.tuple([z.string()]).or(z.array(z.string())).optional(),
  isPaid: z.boolean().optional(),
  content: z.string().min(1).optional(),
});


type BlogFormType = z.infer<typeof blogSchema>;
type UpdateBlogType = z.infer<typeof updateBlogSchema>;

export { blogSchema, updateBlogSchema };
export type { BlogFormType, UpdateBlogType };
