"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/profile/signup');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const floatingImages = document.querySelectorAll('.floating-image');
      floatingImages.forEach((image, index) => {
        const offset = (index + 1) * 50; // Adjust the multiplier for speed
        (image as HTMLElement).style.transform = `translateX(${scrollY / offset}px)`;
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const topPhysiotherapists = [
    {
      name: "Dr. Ana García",
      specialty: "Fisioterapia Deportiva",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3328&auto=format&fit=crop",
      location: "Madrid",
      reviews: 128
    },
    {
      name: "Dr. Carlos Rodríguez",
      specialty: "Rehabilitación Neurológica",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=3270&auto=format&fit=crop",
      location: "Barcelona",
      reviews: 96
    },
    {
      name: "Dra. Laura Martínez",
      specialty: "Fisioterapia Pediátrica",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=3270&auto=format&fit=crop",
      location: "Valencia",
      reviews: 112
    }
  ];

  return (
    <div className={`min-h-screen w-full`}>
      <div className="relative my-8" style={{ height: "100px" }}></div>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="floating-image" style={{ left: '10%', top: '20%' }}>
            <Image src="/static/1_heart.webp" alt="Floating Image 1" width={100} height={100} />
          </div>
          <div className="floating-image" style={{ right: '15%', top: '30%' }}>
            <Image src="/static/4_shine.webp" alt="Floating Image 2" width={100} height={100} />
          </div>
          <div className="floating-image" style={{ left: '20%', bottom: '10%' }}>
            <Image src="/static/7_treatment.webp" alt="Floating Image 3" width={100} height={100} />
          </div>
        </div>
        <Image
          src={"/static/fisio_find_logo.webp"}
          alt="Fisio Find Logo"
          width={256}
          height={256}
          className="mb-8"
        />
        <h1 className={`text-6xl font-bold mb-4 font-alfa-slab-one`}>
          Fisio Find
        </h1>
        <p className={`text-xl mb-8 max-w-2xl`}>
          Empowering educators with intelligent tools for seamless teaching and assessment
        </p>
      </section>

      {/* Top Physiotherapists Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Top Fisioterapeutas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPhysiotherapists.map((physio, index) => (
            <CardContainer key={index}>
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                  {physio.name}
                </CardItem>
                <CardItem as="p" translateZ="40" className="text-neutral-500 text-sm mt-2 dark:text-neutral-300">
                  {physio.specialty}
                </CardItem>
                <CardItem translateZ="60" className="w-full mt-4">
                  <img
                    src={physio.image}
                    className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt={physio.name}
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-6">
                  <CardItem translateZ="20" className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{physio.rating}</span>
                    <span className="text-sm text-neutral-500">({physio.reviews} reviews)</span>
                  </CardItem>
                  <CardItem
                    translateZ="20"
                    as="button"
                    className="px-4 py-2 rounded-xl bg-[#1E5ACD] text-white text-sm font-bold hover:bg-[#1848A3] transition-colors"
                  >
                    Ver perfil
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Buscar Fisioterapeutas</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar fisioterapeutas..."
            className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-200 
            dark:border-neutral-700 bg-white dark:bg-neutral-800 
            focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] focus:border-transparent
            transition-all duration-200 shadow-sm"
          />
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 
            bg-[#1E5ACD] hover:bg-[#1848A3] text-white px-6 py-2 rounded-xl
            transition-all duration-200 flex items-center gap-2"
          >
            <span>Buscar</span>
          </button>
        </div>
      </section>


      {/* Footer */}
      <footer className={`py-12 px-4`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Fisio Find</h3>
            <p>Una plataforma innovadora diseñada para conectar pacientes con los mejores fisioterapeutas.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Útiles</h3>
            <ul>
              <li><a href="https://fisiofind.netlify.app" target="_blank" rel="noopener noreferrer">Conoce Fisio Find</a></li>
              <li><a href="https://github.com/Proyecto-ISPP/FISIOFIND" target="_blank" rel="noopener noreferrer">Repositorio GitHub</a></li>
              <li><a href="https://fisiofind.vercel.app">Documentación</a></li>
              <li><a href="/">Términos de Servicio</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p>Correo: support@fisiofind.com</p>
            <p>Ubicación: Sevilla, España</p>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p>© 2025 Fisio Find. Bajo licencia MIT</p>
        </div>
      </footer>
    </div>
  );
};

export default function Main() {
  return <Home />;
}