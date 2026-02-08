import { z } from "zod";
import { UserRole } from "./enum";

export const userCoreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: UserRole,
  image: z.string().nullable().optional(),
});

export const createUserSchema = userCoreSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = userCoreSchema.partial().extend({
  id: z.string().cuid().optional(),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: UserRole,
  }),
});

export type ICreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const UserZodValidation = {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
};
