import { z } from "zod";

export const AspectRatioSchema = z.enum(["9x16", "1x1", "16x9"]);

export const TemplateNameSchema = z.enum(["default", "minimal", "modern"]).default("default");

export const ThemeSchema = z.object({
  brandColor: z.string().default("#3B82F6"),
  accentColor: z.string().optional(),
  backgroundColor: z.string().default("#FFFFFF"),
});

export const AppVideoConfigSchema = z.object({
  appName: z.string().describe("应用名称"),
  icon: z.union([z.string().url(), z.literal("")]).optional().default("").describe("应用图标 URL"),
  qr: z.union([z.string().url(), z.literal("")]).optional().default("").describe("二维码图片 URL"),
  theme: ThemeSchema.optional(),
  template: TemplateNameSchema.describe("视频模板名称"),
  locale: z.enum(["zh-CN", "en-US"]).default("zh-CN"),
  output: z.array(AspectRatioSchema).default(["9x16", "1x1", "16x9"]),
  voiceover: z.boolean().default(false),
  duration: z.number().default(8).describe("视频时长（秒）"),
  fps: z.number().default(30),
});

export type AppVideoConfig = z.infer<typeof AppVideoConfigSchema>;
export type AspectRatio = z.infer<typeof AspectRatioSchema>;
export type TemplateName = z.infer<typeof TemplateNameSchema>;
export type Theme = z.infer<typeof ThemeSchema>;

export function validateConfig(config: unknown): AppVideoConfig {
  return AppVideoConfigSchema.parse(config);
}
