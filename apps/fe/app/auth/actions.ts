"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AuthMode = "signin" | "signup";

const apiUrl = process.env.OBSERVE_API_URL;

export async function authAction(mode: AuthMode, _: any, formData: FormData) {
  try {
    console.log("formdata", formData);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (mode === "signup") {
      if (typeof password !== "string" || password.length < 8) {
        return {
          message: "Password must be at least 8 characters long.",
        };
      }

      const res = await axios.post(
        `${apiUrl}/auth/signup`,
        {
          name,
          email,
          password,
        },
      );

      console.log("redircting", res.data);

      return {
        success: true,
        message: "Account created successfully! Please signin.",
      };
    }

    const res = await axios.post(
      `${apiUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    const token = res.data.access_token;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("token", token);
    }
  } catch (error: any) {
    console.log("error", error?.response?.data);
    const message = error?.response?.data?.message ?? "Something went wrong";
    return {
      message,
    };
  }

  redirect("/dashboard");
}

export async function getAccessToken() {
  return (await cookies()).get("token")?.value || null;
}

export async function signOutAction() {
  console.log("Sign out action triggered");
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/auth/signin");
}
