import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const RegisterSchema = z.object({
  userName: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

const SessionSchema = z.object({
  userId: z.string(),
});

export { LoginSchema, RegisterSchema, SessionSchema };
