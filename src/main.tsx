import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { API_STORAGE_KEY, getApiUrl } from "./config";

// Inicializar api_url en localStorage solo si no existe
if (!localStorage.getItem(API_STORAGE_KEY)) {
  const apiUrl = getApiUrl();
  if (apiUrl) {
    localStorage.setItem(API_STORAGE_KEY, apiUrl);
  }
}

createRoot(document.getElementById("root")!).render(<App />);

