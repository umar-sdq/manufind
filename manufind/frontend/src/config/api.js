const API_BASE_URL = import.meta.env.PROD
  ? "https://manufind-back2.vercel.app"   
  : "http://localhost:5001";              
export default API_BASE_URL;
