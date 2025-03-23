"use client";

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconFileText,
  IconCookie,
  IconLock,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface TermItem {
  id: number;
  title: string;
  content: string;
  version: string;
  icon: React.ReactNode;
  tag?: string; // optional
}

interface ApiTermItem {
  id: number;
  content: string;
  version: string;
  tag: string;
  tag_display: string;
  created_at: string;
  updated_at: string;
  modifier: number;
}

// First, update the POLICY_ORDER constant at the top of the file
const POLICY_ORDER = {
  'cookies': 1,
  'terms': 2,
  'license': 3,
  'privacy': 4
} as const;

export default function TermsPage(): React.ReactElement {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noTermsFound, setNoTermsFound] = useState<boolean>(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editVersion, setEditVersion] = useState<string>("");

  // State for adding a new term
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTermType, setNewTermType] = useState<string>("");
  const [newTermContent, setNewTermContent] = useState<string>("");
  const [newTermVersion, setNewTermVersion] = useState<string>(""); // Let admin pick a version

  // If your backend needs "modifier," uncomment and adapt:
  // const [modifier, setModifier] = useState<number | null>(null);

  const [activeTermId, setActiveTermId] = useState<number | null>(null);

  // All possible term types
  const getAvailableTermTypes = () => {
    const allTypes = [
      { value: "terms", label: "Términos de Uso" },
      { value: "cookies", label: "Política de Cookies" },
      { value: "privacy", label: "Política de Privacidad" },
      { value: "license", label: "Licencias" },
    ];
    const existingTypes = terms.map((term) => term.tag);
    // Filter out tags that already exist if you only allow one of each type
    return allTypes.filter((type) => !existingTypes.includes(type.value));
  };

  // Check if user is admin
  const [adminUsername, setAdminUsername] = useState<string>("");

  // Modify the checkUserRole function in useEffect
  useEffect(() => {
    const checkUserRole = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user not authenticated");
          return;
        }

        const response = await axios.get(
          `${getApiBaseUrl()}/api/app_user/check-role/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.user_role === "admin") {
          setIsAdmin(true);
          setAdminUsername(response.data.username); // Store the username
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };

    if (typeof window !== "undefined") {
      checkUserRole();
    }
  }, []);

  

  // Fetch terms
  useEffect(() => {
    const fetchTerms = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");

        // First try to fetch with authentication if token exists
        if (token) {
          try {
            const response = await axios.get<ApiTermItem[]>(
              `${getApiBaseUrl()}/api/terms/list/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                timeout: 5000,
              }
            );
            if (response.data && response.data.length > 0) {
              processTermsData(response.data);
              return;
            }
          } catch (authErr: any) {
            console.log("Authenticated request failed:", authErr.response?.status);
            // If we get a 401, the token might be expired or invalid
            if (authErr.response?.status === 401) {
              console.log("Authentication token may be expired");
            }
          }
        }

        // Fallback to public request
        try {
          const publicResponse = await axios.get<ApiTermItem[]>(
            `${getApiBaseUrl()}/api/terms/list/`,
            {
              timeout: 5000,
            }
          );
          if (publicResponse.data && publicResponse.data.length > 0) {
            processTermsData(publicResponse.data);
            return;
          }
        } catch (publicErr) {
          console.log("Public request also failed");
          setNoTermsFound(true);
        }

        // If we get here, we couldn't load the terms
        setNoTermsFound(true);
      } catch (err) {
        console.error("Error fetching terms:", err);
        setNoTermsFound(true);
      } finally {
        setLoading(false);
      }
    };

    const processTermsData = (data: ApiTermItem[]): void => {
      const existingTerms: TermItem[] = [];

      // Create terms in any order
      const termsMap = {
        terms: data.find((term) => term.tag === "terms"),
        cookies: data.find((term) => term.tag === "cookies"),
        privacy: data.find((term) => term.tag === "privacy"),
        license: data.find((term) => term.tag === "license")
      };

      // Process them in the desired order
      Object.entries(termsMap).forEach(([tag, term]) => {
        if (term) {
          let title = "";
          let icon = null;

          switch (tag) {
            case "cookies":
              title = "Política de Cookies";
              icon = <IconCookie className="h-6 w-6 text-amber-600" />;
              break;
            case "terms":
              title = "Términos de Uso";
              icon = <IconFileText className="h-6 w-6 text-green-600" />;
              break;
            case "license":
              title = "Licencias";
              icon = <IconFileText className="h-6 w-6 text-purple-600" />;
              break;
            case "privacy":
              title = "Política de Privacidad";
              icon = <IconLock className="h-6 w-6 text-blue-600" />;
              break;
          }

          existingTerms.push({
            id: term.id,
            title,
            content: term.content,
            version: term.version,
            icon,
            tag
          });
        }
      });

      // Sort the terms according to the defined order
      existingTerms.sort((a, b) => {
        const orderA = POLICY_ORDER[a.tag as keyof typeof POLICY_ORDER] || 999;
        const orderB = POLICY_ORDER[b.tag as keyof typeof POLICY_ORDER] || 999;
        return orderA - orderB;
      });

      setTerms(existingTerms);
    };

    fetchTerms();
  }, []);

  // --------------- Editing Existing Terms ---------------
  const handleEdit = (id: number, content: string, version: string): void => {
    setEditMode(id);
    setEditContent(content);
    setEditVersion(version);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("¿Está seguro de que desea eliminar este término?")) {
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot delete term.");
        setLoading(false);
        return;
      }

      await axios.delete(`${getApiBaseUrl()}/api/terms/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setTerms((prev) => prev.filter((term) => term.id !== id));
      setLoading(false);
    } catch (err: any) {
      console.error("Error deleting term:", err.response?.data || err);
      setError("Error al eliminar el término. Por favor, inténtelo de nuevo.");
      setLoading(false);
    }
  };

  // Modify the handleAddTerm function to sort terms after adding a new one
  const handleAddTerm = async (): Promise<void> => {
    if (!newTermType || !newTermContent) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot add new term.");
        setLoading(false);
        return;
      }

      const versionToUse = newTermVersion.trim() || "v1.0";

      const response = await axios.post(
        `${getApiBaseUrl()}/api/terms/create/`,
        {
          content: newTermContent,
          version: versionToUse,
          tag: newTermType,
          modifier: adminUsername // Add the modifier field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Map term type to title and icon
      let title = "";
      let icon = null;
      
      switch (newTermType) {
        case "terms":
          title = "Términos de Uso";
          icon = <IconFileText className="h-6 w-6 text-green-600" />;
          break;
        case "cookies":
          title = "Política de Cookies";
          icon = <IconCookie className="h-6 w-6 text-amber-600" />;
          break;
        case "privacy":
          title = "Política de Privacidad";
          icon = <IconLock className="h-6 w-6 text-blue-600" />;
          break;
        case "license":
          title = "Licencias";
          icon = <IconFileText className="h-6 w-6 text-purple-600" />;
          break;
      }

      // After successful creation, add the new term and sort
      const newTerm: TermItem = {
        id: response.data.id,
        title,
        content: newTermContent,
        version: versionToUse,
        icon,
        tag: newTermType,
      };

      setTerms((prev) => {
        const updatedTerms = [...prev, newTerm];
        return updatedTerms.sort((a, b) => {
          const orderA = POLICY_ORDER[a.tag as keyof typeof POLICY_ORDER] || 999;
          const orderB = POLICY_ORDER[b.tag as keyof typeof POLICY_ORDER] || 999;
          return orderA - orderB;
        });
      });

      setShowAddForm(false);
      setNewTermType("");
      setNewTermContent("");
      setNewTermVersion("");
      setLoading(false);
    } catch (err: any) {
      console.error("Error adding term:", err.response?.data || err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Error al añadir el término. Por favor, inténtelo de nuevo.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Skeleton loader for loading state
  const TermSkeleton = (): React.ReactElement => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse"></div>
  );

  // --------------- Rendering Logic ---------------
  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          FISIO FIND - INFORMACIÓN LEGAL
        </h1>
        <BentoGrid className="max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((item) => (
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
        <h1 className="text-3xl font-bold text-center mb-8">
          FISIO FIND - INFORMACIÓN LEGAL
        </h1>
        <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
          <IconAlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Términos No Disponibles</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No se pudieron cargar los términos y condiciones en este momento. Esto puede
            deberse a que:
          </p>
          <ul className="text-left text-gray-600 dark:text-gray-300 mb-4 pl-8 list-disc">
            <li>Los términos están siendo actualizados</li>
            <li>Se requiere iniciar sesión para acceder a esta información</li>
            <li>Hay un problema temporal con el servidor</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Si necesita acceder a esta información, por favor inicie sesión o póngase en
            contacto con nuestro equipo de soporte.
          </p>

          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Panel de Administrador</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Añadir Nuevo Término
              </button>
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">Añadir Nuevo Término</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tipo de Término
                </label>
                <select
                  value={newTermType}
                  onChange={(e) => setNewTermType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="terms">Términos de Uso</option>
                  <option value="cookies">Política de Cookies</option>
                  <option value="privacy">Política de Privacidad</option>
                  <option value="license">Licencias</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Contenido</label>
                <textarea
                  value={newTermContent}
                  onChange={(e) => setNewTermContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md h-64"
                  placeholder="Ingrese el contenido HTML del término..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Versión</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder='Ej: "1.0"'
                  value={newTermVersion}
                  onChange={(e) => setNewTermVersion(e.target.value)}
                />
              </div>

              {/* If you need a modifier field, uncomment:
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Modifier (User ID)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder='Ingrese el ID del usuario que modifica'
                  value={modifier ?? ""}
                  onChange={(e) => setModifier(parseInt(e.target.value) || null)}
                />
              </div>
              */}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddTerm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------
  // Normal view: Terms exist
  // ---------------------------------------
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-12">
        FISIO FIND - INFORMACIÓN LEGAL
      </h1>

      {isAdmin && getAvailableTermTypes().length > 0 && (
        <div className="mb-10 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center shadow-sm"
          >
            <IconPlus className="mr-2" size={16} />
            Añadir Nuevo Término
          </button>
        </div>
      )}

      <BentoGrid className="max-w-6xl mx-auto">
        {terms.map((term, i) => {
          let firstSentence;
          const termTag = term.tag;

          // Helper: truncate text by word count
          const truncateByWords = (text: string, wordLimit: number): string => {
            const words = text.split(" ");
            if (words.length <= wordLimit) return text;
            return words.slice(0, wordLimit).join(" ").concat("...");
          };

          // Custom logic to show partial content
          if (termTag === "terms" || termTag === "license") {
            // Attempt to split by "## 4. "
            const content = term.content.split("## 4. ")[1] || term.content;
            firstSentence = truncateByWords(content, 45);
          } else if (termTag === "cookies" || termTag === "privacy") {
            const content = term.content.split("## 4. ")[1] || term.content;
            firstSentence = truncateByWords(content, 30);
          } else {
            firstSentence = truncateByWords(term.content, 45);
          }

          return (
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
                editMode === term.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md h-64 text-sm font-mono"
                      placeholder="Escriba el contenido en formato Markdown..."
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditMode(null)}
                        className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        <IconX size={16} />
                      </button>
                      <button
                        onClick={() => handleSave(term.id)}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <IconCheck size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="text-sm">
                    <div className="prose dark:prose-invert prose-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {firstSentence}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => setActiveTermId(term.id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Ver documento completo
                      </button>

                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleEdit(term.id, term.content, term.version)
                            }
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(term.id)}
                            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
              icon={term.icon}
              className={
                term.title === "Términos de Uso"
                  ? "md:col-span-2"
                  : term.title === "Política de Cookies"
                  ? "md:col-span-1"
                  : term.title === "Política de Privacidad"
                  ? "md:col-span-1"
                  : term.title === "Licencias"
                  ? "md:col-span-2"
                  : ""
              }
            />
          );
        })}
      </BentoGrid>

      {/* Additional Info */}
      <div className="max-w-4xl mx-auto mb-16 prose dark:prose-invert prose-sm text-center space-y-6">
        <br />
        <br />
        <p className="text-gray-600 dark:text-gray-300">
          Estos acuerdos son aplicables a todos los usuarios que accedan a la
          plataforma FisioFind, ya sea a través de navegadores web o aplicaciones
          móviles.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          FisioFind se reserva el derecho de modificar estos acuerdos en función
          de cambios legislativos o necesidades operativas.
        </p>
        <p>
          El presente acuerdo se regirá e interpretará de acuerdo con la legislación
          española.
        </p>
        <p>
          La utilización de la plataforma implica la aceptación íntegra de todas las
          condiciones aquí expuestas.
        </p>
        <br />

        <hr className="my-8 border-gray-200 dark:border-gray-700" />
      </div>

      {/* Modal for displaying full content */}
      {activeTermId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {(() => {
              const activeTerm = terms.find((term) => term.id === activeTermId);
              if (!activeTerm) return null;

              return (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {activeTerm.title} - {activeTerm.version}
                    </h3>
                    <button
                      onClick={() => setActiveTermId(null)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <IconX size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {activeTerm.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                      onClick={() => {
                        const blob = new Blob([activeTerm.content], {
                          type: "text/markdown",
                        });
                        const url = URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${activeTerm.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}-${activeTerm.version}.md`;
                        document.body.appendChild(a);
                        a.click();

                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Descargar documento
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Term Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Añadir Nuevo Término</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de Término</label>
              <select
                value={newTermType}
                onChange={(e) => setNewTermType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccione un tipo</option>
                {getAvailableTermTypes().map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Contenido</label>
              <textarea
                value={newTermContent}
                onChange={(e) => setNewTermContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-64"
                placeholder="Ingrese el contenido HTML del término..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Versión</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder='Ej: "1.0"'
                value={newTermVersion}
                onChange={(e) => setNewTermVersion(e.target.value)}
              />
            </div>

            {/* If you need a modifier field, uncomment:
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Modifier (User ID)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder='Ingrese el ID del usuario que modifica'
                value={modifier ?? ""}
                onChange={(e) => setModifier(parseInt(e.target.value) || null)}
              />
            </div>
            */}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTerm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Última actualización: {new Date().toLocaleDateString()}</p>
        <p>
          Si tiene alguna pregunta sobre nuestros términos o no puede acceder a ellos, por favor
          contáctenos.
        </p>
      </div>
    </div>
  );
}