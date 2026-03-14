import { z } from "zod";

import { localeCodes } from "@/lib/i18n";
import { leadSchema } from "@/lib/validators/lead";

export const contactFormSchema = leadSchema.pick({
  name: true,
  email: true,
  company: true,
  message: true,
}).extend({
  locale: z.enum(localeCodes).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
