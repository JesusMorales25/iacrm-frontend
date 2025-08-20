import { jwtDecode } from "jwt-decode";

// 🔹 Variables de entorno (Vite inyecta en build)
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const API_BASE_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// 🔹 Devuelve URL base (localStorage > .env)
function getApiBaseUrl() {
  return localStorage.getItem(API_BASE_KEY) || API_BASE_URL;
}

function getStorage(remember?: boolean) {
  return remember ? window.localStorage : window.localStorage; // Forzado a localStorage
}

export async function login(email: string, password: string, remember = false) {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
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
      // ignorar error al parsear JSON
    }
    if (res.status === 401) message = "Credenciales inválidas";
    throw new Error(message);
  }

  const data = await res.json();
  const token: string | undefined = data?.token || data?.access_token;
  if (!token) throw new Error("Token no recibido desde el servidor");

  saveToken(token, remember);

  const user = getCurrentUser();
  return { token, user };
}

export function saveToken(token: string, remember = false) {
  removeToken();
  const storage = getStorage(remember);
  storage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    ...(init?.headers || {}),
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    logout();
    window.location.href = "/login";
  }

  return response;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  try {
    removeToken();
    localStorage.removeItem(API_BASE_KEY);
    localStorage.removeItem("user_preferences");
    sessionStorage.clear();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
}

export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}

export function getCurrentUser(): {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
} | null {
  const token = getToken();
  if (!token) return null;

  try {
    const p = decodeToken(token);

    const rawRole = (p.role as string) ?? "user";
    const role: UserRole = mapBackendRole(rawRole);

    const id = (p.id ?? p.sub ?? "").toString();
    const email = (p.email ?? p.sub ?? "").toString();
    const name = (p.name ?? email).toString();

    const companyRaw = p.empresaId ?? p.empresa ?? p.company ?? "";
    const company = companyRaw ? companyRaw.toString() : undefined;

    return { id, email, name, role, company };
  } catch (err) {
    removeToken();
    return null;
  }
}

function mapBackendRole(raw: string): UserRole {
  const normalized = raw.replace(/^ROLE_/i, "").toLowerCase();
  if (normalized.includes("superadmin")) return "superadmin";
  if (normalized.includes("admin")) return "admin";
  if (
    normalized.includes("user") ||
    normalized.includes("agent") ||
    normalized.includes("agente") ||
    normalized.includes("supervisor")
  )
    return "user";
  return "user";
}
