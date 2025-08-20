// main.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1️⃣ Tomamos el valor desde las variables de entorno de Vite
const defaultApiUrl = import.meta.env.VITE_API_URL;

// 2️⃣ Guardamos solo si no existe en localStorage
if (!localStorage.getItem('api_url')) {
  localStorage.setItem('api_url', defaultApiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
