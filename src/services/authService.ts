import { jwtDecode } from "jwt-decode";
import { getApiUrl, API_STORAGE_KEY } from "../config";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "token";

type UserRole = "superadmin" | "admin" | "user";

interface TokenPayload {
  sub?: string;
  email?: string;
  role?: string | UserRole;
  id?: string | number;
  name?: string;
  empresa?: string;
  empresaId?: string;
  company?: string;
  avatar?: string;
  exp?: number;
  [key: string]: unknown;
}

export async function login(email: string, password: string, remember = false) {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error("❌ No se encontró la URL base de la API.");

  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password }),
  });

  if (!res.ok) {
    let message = "Error de autenticación";
    try {
			const err = await res.json();
			message = err?.message || message;
		} catch {
			// Ignorar error si no se puede parsear JSON
		}

    if (res.status === 401) message = "Credenciales inválidas";
    throw new Error(message);
  }

  const data = await res.json();
  const token: string | undefined = data?.token || data?.access_token;
  if (!token) throw new Error("Token no recibido desde el servidor");

  saveToken(token, remember);
  return { token, user: getCurrentUser() };
}

export function saveToken(token: string, remember = false) {
  const storage = window.localStorage;
  storage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  try {
    removeToken();
    localStorage.removeItem(API_STORAGE_KEY);
    localStorage.removeItem("user_preferences");
    sessionStorage.clear();
    window.location.href = "/login";
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
}

export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const p = decodeToken(token);
    const role: UserRole = mapBackendRole(p.role as string ?? "user");
    return {
      id: (p.id ?? p.sub ?? "").toString(),
      email: (p.email ?? p.sub ?? "").toString(),
      name: (p.name ?? p.email ?? "").toString(),
      role,
      company: (p.empresaId ?? p.empresa ?? p.company ?? "").toString(),
    };
  } catch {
    removeToken();
    return null;
  }
}

function mapBackendRole(raw: string): UserRole {
  const normalized = raw.replace(/^ROLE_/i, "").toLowerCase();
  if (normalized.includes("superadmin")) return "superadmin";
  if (normalized.includes("admin")) return "admin";
  return "user";
}
