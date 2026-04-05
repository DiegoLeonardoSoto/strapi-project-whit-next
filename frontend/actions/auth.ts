"use server";

import { registerUserService } from "@/lib/strapi";
import { FormState, SignupFormSchema } from "@/validations/auth";
import z from "zod";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieConfig = {
  maxAge: 60 * 60 * 24, // 1 day
  path: "/",
  httpOnly: true, // only accessible via HTTP(S), not JavaScript
  domain: process.env.HOST ?? "localhost", // set to your domain
  secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
};

export async function registerUserAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  console.log("Hello from register user action");

  const fields = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    console.log("validation errors:", flattenedErrors.fieldErrors);

    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const response = await registerUserService(validatedFields.data);

  if (!response || response.error) {
    return {
      success: false,
      message: "Failed to register user",
      strapiErrors: response?.error || null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: "jwt",
    value: response.jwt,
    ...cookieConfig,
  });

  redirect("/dashboard");
}
