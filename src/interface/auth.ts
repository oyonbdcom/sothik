import { UserRole } from "@/types";
import {
  ChangePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@/zod-validation/auth";

export type ILoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    phoneNumber: string;
    role: UserRole;
  };
};

import z from "zod";

// 1. Login Request
export type IRegisterRequest = z.infer<typeof registerSchema>;
export type ILoginRequest = z.infer<typeof loginSchema>;

// 3. Forgot Password Request
// Extracts the email from the body object
export type IForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

// 5. Resend Verification Request
export type IResendVerificationRequest = z.infer<
  typeof resendVerificationSchema
>;

// 6. Change Password Request
export type IChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;

// 7. Update Profile Request
export type IUpdateProfileRequest = z.infer<typeof updateProfileSchema>;

// 8. Reset Password Request
export type IResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
