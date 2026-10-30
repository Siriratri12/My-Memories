import { ref } from "vue";
import { apiRequest } from "../services/api";
import type { User } from "../types/memory";

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}

const token = ref(sessionStorage.getItem("token") || "");
const user = ref<User | null>(null);

export function useAuth() {
  async function login(email: string, password: string) {
    const result = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    sessionStorage.setItem("token", result.token);
    token.value = result.token;
    user.value = result.user;
  }

  async function register(name: string, email: string, password: string) {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async function updateProfile(name: string) {
    if (!token.value) {
      throw new Error("กรุณาเข้าสู่ระบบ");
    }

    const result = await apiRequest<UpdateProfileResponse>(
      "/auth/me",
      {
        method: "PUT",
        body: JSON.stringify({ name: name.trim() }),
      },
      token.value,
    );

    user.value = result.user;
    return result.user;
  }

  function logout() {
    sessionStorage.removeItem("token");
    token.value = "";
    user.value = null;
  }

  async function restoreSession() {
    if (!token.value) return;

    try {
      user.value = await apiRequest<User>("/auth/me", {}, token.value);
    } catch {
      logout();
    }
  }

  return {
    token,
    user,
    login,
    register,
    updateProfile,
    logout,
    restoreSession,
  };
}
