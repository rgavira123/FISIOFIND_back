"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Phone, Mail, MapPin, Calendar, FileText, Users, Camera, Save, Check } from 'lucide-react';

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    user: {
      username: "",
      email: "",
      phone_number: "",
      postal_code: "",
      dni: "",
      photo: "",
      account_status: "",
    },
    gender: "",
    birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);

  // Mock function for getApiBaseUrl to make the component work in isolation
  const getApiBaseUrl = () => "https://api.example.com";
  const BASE_URL = getApiBaseUrl();

  useEffect(() => {
    setIsClient(true);
    // Simulating fetch for demo purposes
    setTimeout(() => {
      setProfile({
        user: {
          username: "patient123",
          email: "patient@example.com",
          phone_number: "123456789",
          postal_code: "28001",
          dni: "12345678A",
          photo: "/api/placeholder/200/200",
          account_status: "active",
        },
        gender: "M",
        birth_date: "1990-01-01",
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prevProfile) => {
      if (name === "gender" || name === "birth_date") {
        return { ...prevProfile, [name]: value };
      }
      return {
        ...prevProfile,
        user: {
          ...prevProfile.user,
          [name]: value,
        },
      };
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    // Simulate preview
    if (e.target.files[0]) {
      setProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          preview: URL.createObjectURL(e.target.files[0])
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Perfil actualizado correctamente");
    // Just for demonstration
  };

  const getImageSrc = () => {
    if (profile.user.preview) {
      return profile.user.preview;
    }
    if (profile?.user?.photo) {
      return profile.user.photo;
    }
    return "/api/placeholder/200/200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" 
           style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)" }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)" }}>
      
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar with photo and user info */}
          <div className="bg-gradient-to-b from-[#1E5ACD] to-[#3a6fd8] p-8 md:w-1/3 flex flex-col items-center justify-start text-white">
            <div className="relative mb-6 mt-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={getImageSrc()} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <label htmlFor="file-input" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer text-[#1E5ACD] hover:bg-gray-100 transition-all duration-200">
                <Camera size={20} />
              </label>
              <input 
                id="file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
            </div>
            
            <h2 className="text-xl font-bold mb-1">{profile?.user?.username || "Nombre de usuario"}</h2>
            <p className="text-blue-100 mb-6">Paciente</p>
            
            <div className="w-full space-y-4">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 opacity-70" />
                <p className="text-sm truncate">{profile?.user?.email || ""}</p>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 opacity-70" />
                <p className="text-sm">{profile?.user?.phone_number || ""r}</p>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="mr-2 opacity-70" />
                <p className="text-sm">DNI: {profile?.user?.dni || ""}</p>
              </div>
            </div>
          </div>
          
          {/* Right side with form */}
          <div className="p-8 md:w-2/3">
            <h1 className="text-2xl font-bold mb-6"
                style={{ 
                  background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
              Perfil del Paciente
            </h1>
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                <Check size={18} className="mr-2" />
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.user.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone_number"
                      value={profile.user.phone_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                    />
                  </div>
                  {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      name="postal_code"
                      value={profile.user.postal_code}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                    />
                  </div>
                  {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      name="birth_date"
                      value={profile.birth_date}
                      disabled={true}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Users size={18} />
                    </div>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)] appearance-none bg-white"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-[#1E5ACD] to-[#3a6fd8] text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
                style={{ boxShadow: "0 4px 12px rgba(30, 90, 205, 0.2)" }}
              >
                <Save size={18} className="mr-2" />
                Actualizar Perfil
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;