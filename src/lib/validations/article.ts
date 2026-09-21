// src/lib/validations/article.ts
import { z } from 'zod'
import { ArticleStatus, ContentType, DifficultyLevel } from '@prisma/client'

export const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().min(3).max(250).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, 'Content is required'),
  contentJson: z.any().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  coverImageAlt: z.string().max(200).optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  contentType: z.nativeEnum(ContentType).default(ContentType.ARTICLE),
  difficulty: z.nativeEnum(DifficultyLevel).optional(),
  readingTime: z.number().int().positive().optional(),
  status: z.nativeEnum(ArticleStatus).default(ArticleStatus.DRAFT),
  featured: z.boolean().default(false),
  scheduledAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  references: z.array(z.object({ title: z.string(), url: z.string().url() })).optional(),
  revisionNote: z.string().max(500).optional(),
})

export const createArticleSchema = articleSchema.omit({ status: true })
export const updateArticleSchema = articleSchema.partial()

export type ArticleInput = z.infer<typeof articleSchema>
export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
