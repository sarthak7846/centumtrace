"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

type Project = {
  id: string;
  name: string;
  description?: string;
};

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt?: string;
};

async function apiRequest<T>(
  path: string,
  method: "GET" | "POST",
  body?: unknown,
): Promise<ActionResult<T>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Your session has expired. Please log in again.",
      };
    }

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message ?? "Something went wrong. Please try again.",
      };
    }

    // Supports APIs returning either { data: ... } or the object directly.
    return {
      success: true,
      data: (result.data ?? result) as T,
    };
  } catch {
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
    };
  }
}

export async function createProjectAction(input: {
  name: string;
  description?: string;
}): Promise<ActionResult<Project>> {
  return apiRequest<Project>("/projects", "POST", input);
}

export async function createApiKeyAction(input: {
  projectId: string;
  name: string;
}): Promise<ActionResult<ApiKey>> {
  return apiRequest<ApiKey>(`/projects/${input.projectId}/api-keys`, "POST", {
    name: input.name,
  });
}
