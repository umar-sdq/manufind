const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_PROD ||
    "https://votre-backend-url.vercel.app"
  : import.meta.env.VITE_API_BASE_URL_DEV || "http://localhost:5001";

export default API_BASE_URL;
