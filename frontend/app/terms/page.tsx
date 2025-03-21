"use client";

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconFileText,
  IconCookie,
  IconLock,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

interface TermItem {
  id: number;
  title: string;
  content: string;
  version: string;
  icon: React.ReactNode;
}

interface ApiTermItem {
  id: number;
  content: string;
  version: string;
  created_at: string;
  updated_at: string;
  modifier: number;
}

export default function TermsPage(): React.ReactElement {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noTermsFound, setNoTermsFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchTerms = async (): Promise<void> => {
      try {
        const response = await axios.get<ApiTermItem[]>(`${getApiBaseUrl()}/api/terminos/`, {
          validateStatus: function (status: number): boolean {
            return true;
          },
          timeout: 5000
        });
        
        // Handle different status codes
        if (response.status === 401 || response.status === 403) {
          console.log("Autenticación requerida para acceder a los términos");
          setNoTermsFound(true);
          setLoading(false);
          return;
        }
        
        if (response.status === 404 || !response.data || response.data.length === 0) {
          setNoTermsFound(true);
          setLoading(false);
          return;
        }
        
        const termsOfUse = response.data.find(term => term.version.toLowerCase().includes('terms'));
        const cookiePolicy = response.data.find(term => term.version.toLowerCase().includes('cookie'));
        const privacyPolicy = response.data.find(term => term.version.toLowerCase().includes('privacy'));
        
        setTerms([
          {
            id: termsOfUse?.id || 1,
            title: "Términos de Uso",
            content: termsOfUse?.content || "El contenido de los términos de uso se mostrará aquí.",
            version: termsOfUse?.version || "v1.0",
            icon: <IconFileText className="h-6 w-6 text-green-600" />,
          },
          {
            id: cookiePolicy?.id || 2,
            title: "Política de Cookies",
            content: cookiePolicy?.content || "El contenido de la política de cookies se mostrará aquí.",
            version: cookiePolicy?.version || "v1.0",
            icon: <IconCookie className="h-6 w-6 text-amber-600" />,
          },
          {
            id: privacyPolicy?.id || 3,
            title: "Política de Privacidad",
            content: privacyPolicy?.content || "El contenido de la política de privacidad se mostrará aquí.",
            version: privacyPolicy?.version || "v1.0",
            icon: <IconLock className="h-6 w-6 text-blue-600" />,
          },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los términos:", err);
        setNoTermsFound(true);
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const TermSkeleton = (): React.ReactElement => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse"></div>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">FISIO FIND - INFORMACIÓN LEGAL</h1>
        <BentoGrid className="max-w-6xl mx-auto">
          {[1, 2, 3].map((item) => (
            <BentoGridItem
              key={item}
              header={<TermSkeleton />}
              title="Cargando..."
              description="Por favor espere mientras cargamos el contenido."
              icon={<IconRefresh className="h-4 w-4 text-neutral-500 animate-spin" />}
              className={item === 3 ? "md:col-span-3" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (noTermsFound) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">FISIO FIND - INFORMACIÓN LEGAL</h1>
        <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
          <IconAlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Términos No Disponibles</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No se pudieron cargar los términos y condiciones en este momento. Esto puede deberse a que:
          </p>
          <ul className="text-left text-gray-600 dark:text-gray-300 mb-4 pl-8 list-disc">
            <li>Los términos están siendo actualizados</li>
            <li>Se requiere iniciar sesión para acceder a esta información</li>
            <li>Hay un problema temporal con el servidor</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Si necesita acceder a esta información, por favor inicie sesión o póngase en contacto con nuestro equipo de soporte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">FISIO FIND - INFORMACIÓN LEGAL</h1>
      
      <BentoGrid className="max-w-6xl mx-auto">
        {terms.map((term, i) => (
          <BentoGridItem
            key={i}
            title={
              <div className="flex items-center justify-between">
                <span>{term.title}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {term.version}
                </span>
              </div>
            }
            description={
              <div className="max-h-[300px] overflow-y-auto pr-2 text-sm">
                <div dangerouslySetInnerHTML={{ __html: term.content }} />
              </div>
            }
            icon={term.icon}
            className={i === 2 ? "md:col-span-3" : ""}
          />
        ))}
      </BentoGrid>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Última actualización: {new Date().toLocaleDateString()}</p>
        <p>Si tiene alguna pregunta sobre nuestros términos o no puede acceder a ellos, por favor contáctenos.</p>
      </div>
    </div>
  );
}