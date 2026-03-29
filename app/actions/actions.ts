"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface User {
  id: string;
  name: string | null;
  email: string;
  createAt: string;
  updateAt: string;
}


export async function getUsers(
  strategy: "SSG" | "SSR" | "ISR",
): Promise<User[]> {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  }

  let fetchOptions: RequestInit = {};

  if (strategy === "SSG") fetchOptions = { cache: "force-cache" };
  if (strategy === "SSR") fetchOptions = { cache: "no-store" };
  if (strategy === "ISR") fetchOptions = { next: { revalidate: 40 } };

  const url = `${API_URL}/user`;
  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch users: ${res.status} ${res.statusText} (${url})`,
    );
  }
  const json = await res.json();

  return Array.isArray(json?.data) ? json.data : []; 
}




export async function createUser(formData: FormData) {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  }

  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !name || !password) {
    throw new Error("Create user failed: email, name, password are required");
  }

  const url = `${API_URL}/user`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });

  // if (!res.ok) {
  //   let details = "";

  //   try {
  //     const errorJson = await res.json();
  //     details = JSON.stringify(errorJson);
  //   } catch {
  //     details = await res.text().catch(() => "");
  //   }

  //   // throw new Error(
  //   //   `Failed to create user: ${res.status} ${res.statusText} (${url})${details ? ` - ${details}` : ""}`,
  //   // );
  //   throw new Error(details || "Có lỗi xảy ra khi tạo user!");
  // }
if (!res.ok) {
    let errorMessage = "Tạo user thất bại!"; // Lỗi mặc định

    try {
      const errorData = await res.json();
      
      // Xử lý thông minh: Dù backend trả về Mảng lỗi hay Chuỗi lỗi đều đọc được
      if (errorData && errorData.message) {
        errorMessage = Array.isArray(errorData.message) 
          ? errorData.message[0] // Nếu là mảng, lấy câu lỗi đầu tiên
          : errorData.message;   // Nếu là chuỗi, lấy luôn
      }
    } catch (e) {
      // Bỏ qua nếu không đọc được JSON
    }

    // Ném lỗi ra ngoài
    throw new Error(errorMessage);
  }
  return res.json();
}


export async function deleteUser(id: string) {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  }

  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let details = "";

    try {
      const errorJson = await res.json();
      details =
        typeof errorJson?.message === "string"
          ? errorJson.message
          : JSON.stringify(errorJson);
    } catch {
      details = await res.text().catch(() => "");
    }

    // throw new Error(
    //   `Failed to delete user: ${res.status} ${res.statusText}${details ? ` - ${details}` : ""}`,
    // );

    throw new Error(details || "Có lỗi xảy ra khi xóa user!");
  }

  try {
    const payload = await res.json();
    const message =
      typeof payload?.data?.message === "string"
        ? payload.data.message
        : "Xoa user thanh cong";
    return { success: true, message };
  } catch {
    return { success: true, message: "Xoa user thanh cong" };
  }
}
export async function updateUser(id: string, formData: FormData) {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  }

  // Lấy dữ liệu từ form
  const email = formData.get("email")?.toString();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  // Gom dữ liệu lại (NestJS dùng PATCH nên thường chỉ cần gửi những trường cần sửa)
  // Nếu password rỗng (người dùng không muốn đổi pass), ta không gửi lên.
  const payload: any = { email, name };
  if (password) {
    payload.password = password;
  }

  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "PATCH", // Chuẩn theo backend của bạn
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Cập nhật user thất bại!";
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message[0]
          : errorData.message;
      }
    } catch (e) {
      // Bỏ qua
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
