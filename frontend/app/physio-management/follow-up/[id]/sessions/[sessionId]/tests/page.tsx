"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface TestFormData {
  question: string;
  test_type: "text" | "scale";
  scale_labels?: Record<string, string>;
}

const TestPage = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const treatmentId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingTest, setExistingTest] = useState<TestFormData | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    test_type: "text",
    scale_labels: [{ scale_value: "1", label: "" }]
  });
  const [error, setError] = useState("");

  // Fetch existing test if available
  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/treatments/sessions/${sessionId}/test/view/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setExistingTest(response.data);
        
        // Set form values from existing test
        setFormData({
          question: response.data.question,
          test_type: response.data.test_type,
          scale_labels: response.data.scale_labels ? 
            Object.entries(response.data.scale_labels).map(([key, value]) => ({
              scale_value: key,
              label: value as string,
            })) : 
            [{ scale_value: "1", label: "" }]
        });

      } catch (error: Error | unknown) {
        if (error.response?.status !== 404) {
          setError("Error al cargar el test");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [sessionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      test_type: e.target.value as "text" | "scale"
    });
  };

  const handleScaleLabelChange = (index: number, field: string, value: string) => {
    const updatedLabels = [...formData.scale_labels];
    updatedLabels[index] = {
      ...updatedLabels[index],
      [field]: value
    };
    setFormData({
      ...formData,
      scale_labels: updatedLabels
    });
  };

  const addScaleLabel = () => {
    setFormData({
      ...formData,
      scale_labels: [...formData.scale_labels, { scale_value: "", label: "" }]
    });
  };

  const removeScaleLabel = (index: number) => {
    const updatedLabels = [...formData.scale_labels];
    updatedLabels.splice(index, 1);
    setFormData({
      ...formData,
      scale_labels: updatedLabels
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    // Format scale labels if present
    const formattedData: TestFormData = {
      question: formData.question,
      test_type: formData.test_type as "text" | "scale",
    };

    if (formData.test_type === "scale" && formData.scale_labels) {
      const scaleLabels: Record<string, string> = {};
      formData.scale_labels.forEach((item: { scale_value: string; label: string }) => {
        if (item.scale_value && item.label) {
          scaleLabels[item.scale_value] = item.label;
        }
      });
      formattedData.scale_labels = scaleLabels;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/treatments/sessions/${sessionId}/test/`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      alert(existingTest ? "Test actualizado correctamente" : "Test creado correctamente");
      router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
    } catch (error) {
      console.error("Error al guardar el test:", error);
      setError("Error al guardar el test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingTest) return;
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/treatments/sessions/${sessionId}/test/delete/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      alert("Test eliminado correctamente");
      router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
    } catch (error) {
      console.error("Error al eliminar el test:", error);
      setError("Error al eliminar el test");
    }
  };

  const handleGoBack = () => {
    router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleGoBack}
          className="mr-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold m-0">
          {existingTest ? "Editar Test" : "Crear Nuevo Test"}
        </h1>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="question">
                Pregunta
              </label>
              <textarea 
                id="question"
                name="question"
                rows={3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese la pregunta para el paciente"
                value={formData.question}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Tipo de respuesta
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="test_type"
                    value="text"
                    checked={formData.test_type === "text"}
                    onChange={handleRadioChange}
                    className="mr-2"
                  />
                  Texto libre
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="test_type"
                    value="scale"
                    checked={formData.test_type === "scale"}
                    onChange={handleRadioChange}
                    className="mr-2"
                  />
                  Escala numérica
                </label>
              </div>
            </div>

            {formData.test_type === "scale" && (
              <div className="mb-4">
                <p className="mb-2 text-gray-700">Etiquetas para la escala numérica:</p>
                {formData.scale_labels.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <div className="w-1/4">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        placeholder="Valor (1-10)"
                        value={item.scale_value}
                        onChange={(e) => handleScaleLabelChange(index, "scale_value", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="w-3/4">
                      <input
                        type="text"
                        placeholder="Etiqueta (ej: 'Poco dolor')"
                        value={item.label}
                        onChange={(e) => handleScaleLabelChange(index, "label", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {formData.scale_labels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScaleLabel(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addScaleLabel}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-md hover:border-gray-400 text-gray-600"
                >
                  + Añadir etiqueta
                </button>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {existingTest && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar Test
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {submitting ? "Procesando..." : existingTest ? "Actualizar" : "Crear"} Test
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TestPage;