import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(25)
    .trim()
    .refine((value) => /^[^';"]*$/.test(value), 'Invalid input'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email()
    .max(155)
    .trim()
    .refine((value) => /^[^';"]*$/.test(value), 'Invalid input'),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(12)
    .toLowerCase()
    .trim()
    .refine((value) => /^[^';"]*$/.test(value), 'Invalid input'),
  password: z
    .string()
    .min(1, 'Password is required')
    .trim()
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
      'One upperCase\nOne lowerCase\nOne Digit\nOne special Character (@ $ ! % * ? &)',
    )
    .refine((value) => /^[^';"]*$/.test(value), 'Invalid input'),
});
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email()
    .max(155)
    .trim()
    .refine((value) => /^[^';"]*$/.test(value), 'Invalid input'),
});

export const CompeteProfileSchema = z.object({
  about: z.string().min(1, 'About is required').trim(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type CompleteProfileType = z.infer<typeof CompeteProfileSchema>;
