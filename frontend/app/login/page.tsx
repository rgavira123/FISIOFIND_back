"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPaciente() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/app_user/login/", formData);
      if (response.status === 200) {
        // Guarda el token en localStorage
        localStorage.setItem("token", response.data.access);
        setMessage("Inicio de sesión exitoso");
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Las credenciales no son válidas");
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f3f3]">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#253240]">Inicio de Sesión</h2>
        {message && (
          <p className={`text-center mb-4 ${message === "Inicio de sesión exitoso" ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="username"
            type="text"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#05668D] text-white py-3 rounded-md hover:bg-[#41b8d5] transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
