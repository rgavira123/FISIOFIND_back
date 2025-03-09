"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importar desde next/navigation
import axios from "axios";
import { clearCachedRole } from "@/services/check-role";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Llama al endpoint /logout solo si hay token
          await axios.post(
            "http://localhost:8000/api/app_user/logout/",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error("Error al desloguear:", error);
        }
        // Elimina el token y limpia la caché
        localStorage.removeItem("token");
        clearCachedRole();
      }
      // Redirige a la página principal (o la que desees)
      router.push("/");
    }
    logout();
  }, [router]);

  return null;
};

export default Logout;
