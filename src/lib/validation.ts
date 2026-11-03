import { z } from "zod";
import { messages } from "../i18n/messages";
import type { Locale } from "../i18n/routing";
export const serviceIds = [
  "audit",
  "local",
  "content",
  "social",
  "consultation",
  "other",
] as const;
export const budgetIds = [
  "under300",
  "300-600",
  "600-1000",
  "1000-2000",
  "2000plus",
  "unsure",
] as const;
export function contactSchema(locale: Locale) {
  const t = messages[locale].form.validation;
  return z.object({
    locale: z.enum(["sk", "en"]),
    name: z.string().trim().min(2, t.required).max(120, t.max),
    email: z.email(t.email).max(254, t.max),
    company: z.string().trim().min(2, t.required).max(180, t.max),
    service: z.enum(serviceIds, { error: t.select }),
    description: z
      .string()
      .trim()
      .min(20, t.description)
      .max(5000, t.description),
    website: z
      .string()
      .trim()
      .max(2048, t.max)
      .refine((v) => {
        if (!v) return true;
        try {
          return ["http:", "https:"].includes(new URL(v).protocol);
        } catch {
          return false;
        }
      }, t.url),
    budget: z.union([z.enum(budgetIds), z.literal("")]),
    method: z.enum(["", "email", "video"]),
    honeypot: z.string().max(200),
    startedAt: z.number(),
    turnstileToken: z.string().max(4096),
  });
}
export type ContactInput = z.infer<ReturnType<typeof contactSchema>>;
