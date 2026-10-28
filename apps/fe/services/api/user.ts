import { apiFetch } from "@/lib/api";

export async function getCurrentUser() {
  const res = await apiFetch("/user/me");

  if (res.error) {
    throw new Error(res.message);
  }

  return res;
}