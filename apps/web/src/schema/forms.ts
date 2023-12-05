import { z } from 'zod';

export const addNewContactSchema = z.object({
  email: z.string().min(1, 'Please Enter Email').email().trim(),
});

export type AddNewContactSchemaType = z.infer<typeof addNewContactSchema>;
