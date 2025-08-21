// src/config.ts

// Lee la API URL desde .env
const ENV_API_URL = import.meta.env.VITE_API_URL;

// Si no existe, error en consola
if (!ENV_API_URL) {
  console.error("❌ ERROR: VITE_API_URL no está definida en las variables de entorno.");
}

// Llave de almacenamiento en localStorage
export const API_STORAGE_KEY = "api_url";

// Función que siempre devuelve la API base
export function getApiUrl(): string {
  const stored = localStorage.getItem(API_STORAGE_KEY);

  // Si no hay nada en localStorage, usa el .env
  return stored || ENV_API_URL || "";
}
