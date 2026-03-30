"use server";

import {
  apiRequest,
  type FetchStrategy,
  getStrategyFetchOptions,
} from "@/lib/api-client";

export interface User {
  id: string;
  name: string | null;
  email: string;
  createAt: string;
  updateAt: string;
}

export async function getUsers(strategy: FetchStrategy): Promise<User[]> {
  const json = await apiRequest<{ data?: User[] }>("/user", {
    ...getStrategyFetchOptions(strategy),
    fallbackErrorMessage: "Failed to fetch users",
  });

  return Array.isArray(json?.data) ? json.data : [];
}

export async function createUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !name || !password) {
    throw new Error("Create user failed: email, name, password are required");
  }

  return apiRequest("/user", {
    method: "POST",
    body: { email, name, password },
    fallbackErrorMessage: "Tạo user thất bại!",
  });
}

export async function deleteUser(id: string) {
  const payload = await apiRequest<{ data?: { message?: string } }>(
    `/user/${id}`,
    {
      method: "DELETE",
      fallbackErrorMessage: "Có lỗi xảy ra khi xóa user!",
    },
  );

  const message =
    typeof payload?.data?.message === "string"
      ? payload.data.message
      : "Xoa user thanh cong";

  return { success: true, message };
}

export async function updateUser(id: string, formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  const name = formData.get("name")?.toString().trim();
  const password = formData.get("password")?.toString().trim();

  const payload: { email?: string; name?: string; password?: string } = {};

  if (email) {
    payload.email = email;
  }

  if (name) {
    payload.name = name;
  }

  if (password) {
    payload.password = password;
  }

  return apiRequest(`/user/${id}`, {
    method: "PATCH",
    body: payload,
    fallbackErrorMessage: "Cập nhật user thất bại!",
  });
}
