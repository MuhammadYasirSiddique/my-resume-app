import { z } from "zod"; // Import Zod for validation

// Define Zod schema for form validation
export const resetPasswordSchema = z
  .object({
    oldpassword: z.string().min(1, "Required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
        "Password must contain:\n • At least 6 characters\n • 1 Uppercase\n • 1 Lowercase\n • 1 Number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
