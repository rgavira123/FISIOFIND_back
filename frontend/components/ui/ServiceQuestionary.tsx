import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useAppointment } from '@/context/appointmentContext';
import { QuestionaryResponse } from '@/lib/definitions';


export interface ServiceQuestionaryRef {
  validateQuestionaryAndContinue: () => boolean;
}

const ServiceQuestionary = forwardRef<ServiceQuestionaryRef>((props, ref) => {
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const questionary = appointmentData.service.questionary;
  
  // Inicializar con las respuestas existentes o un objeto vacío
  const [responses, setResponses] = useState<QuestionaryResponse>(
    appointmentData.questionaryResponses || {}
  );
  
  // Estado para los errores de validación
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Estado para indicar si se intentó enviar el formulario
  const [attempted, setAttempted] = useState(false);
  

    // Exponer el método de validación al componente padre
    useImperativeHandle(ref, () => ({
      validateQuestionaryAndContinue: () => {
        setAttempted(true);
        const isValid = validateForm();
        
        dispatch({
          type: 'SET_QUESTIONARY_COMPLETE',
          payload: isValid
        });
        
        if (!isValid) {
          // Hacer scroll al primer error
          const firstErrorField = document.querySelector('.error-field');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        
        return isValid;
      }
    }));


  // Memoizar la función validateForm para evitar recrearla en cada render
  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;
    
    if (questionary && questionary.elements) {
      questionary.elements.forEach(element => {
        const propertyName = getPropertyNameFromScope(element.scope);
        const value = responses[propertyName];
        
        // Verificar si está vacío (todos los campos son requeridos)
        if (!value || value.trim() === '') {
          newErrors[propertyName] = 'Este campo es obligatorio';
          isValid = false;
          return;
        }
        
        // Validaciones específicas por tipo
        if (element.type === 'Control') {
          if (value.length > 150) {
            newErrors[propertyName] = 'El texto no puede exceder los 150 caracteres';
            isValid = false;
          }
        } else if (element.type === 'Number') {
          if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
            newErrors[propertyName] = 'Debe ingresar un valor numérico';
            isValid = false;
          }
        }
      });
    }
    
    setErrors(newErrors);
    return isValid;
  }, [questionary, responses]);
  
  // Función para extraer el nombre de propiedad desde el scope
  const getPropertyNameFromScope = (scope: string) => {
    // Formato típico: "#/properties/propertyName"
    const parts = scope.split('/');
    return parts[parts.length - 1];
  };
  
  // Calcular si el cuestionario está completo
  const calculateIsComplete = useCallback(() => {
    if (!questionary || !questionary.elements) return false;
    
    return questionary.elements.every(element => {
      const propertyName = getPropertyNameFromScope(element.scope);
      return !!responses[propertyName] && responses[propertyName].trim() !== '';
    }) && Object.keys(errors).length === 0;
  }, [questionary, responses, errors]);
  
  // Actualizar el contexto cuando cambien las respuestas
  useEffect(() => {
    // Actualizar las respuestas en el contexto
    dispatch({
      type: 'UPDATE_QUESTIONARY_RESPONSES',
      payload: responses
    });
    
    // Si ya se intentó enviar, validar en cada cambio
    if (attempted) {
      validateForm();
    }
  }, [responses, dispatch, attempted, validateForm]);
  

  // Efecto separado para actualizar el estado de completitud
  useEffect(() => {
    const isComplete = calculateIsComplete();
    
    dispatch({
      type: 'SET_QUESTIONARY_COMPLETE',
      payload: isComplete
    });
  }, [responses, errors, calculateIsComplete, dispatch]);


  // Si no hay cuestionario, mostramos un mensaje
  if (!questionary || !questionary.elements || questionary.elements.length === 0) {
    return <div className="text-gray-500">No hay cuestionario para este servicio.</div>;
  }

  const handleInputChange = (propertyName: string, value: string, type: string = 'Control') => {
    // Actualizar respuestas
    setResponses(prev => ({ ...prev, [propertyName]: value }));
    
    // Validar el campo actual si ya se ha intentado enviar
    if (attempted) {
      // Limpiar error previo para este campo
      const newErrors = { ...errors };
      
      // Validación de campo requerido
      if (!value || value.trim() === '') {
        newErrors[propertyName] = 'Este campo es obligatorio';
      } else {
        // Validaciones específicas por tipo
        if (type === 'Control') {
          if (value.length > 150) {
            newErrors[propertyName] = 'El texto no puede exceder los 150 caracteres';
          } else {
            delete newErrors[propertyName];
          }
        } else if (type === 'Number') {
          if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
            newErrors[propertyName] = 'Debe ingresar un valor numérico';
          } else {
            delete newErrors[propertyName];
          }
        } else {
          delete newErrors[propertyName];
        }
      }
      
      setErrors(newErrors);
    }
  };


  const renderElement = (element: { type: string; scope: string; label: string }) => {
    const propertyName = getPropertyNameFromScope(element.scope);
    const hasError = !!errors[propertyName];
    const errorClass = hasError ? 'error-field' : '';
    
    if (element.type === 'Control') {
      return (
        <div className={`mb-4 ${errorClass}`} key={propertyName}>
          <label className="block text-gray-700 font-medium mb-2">
            {element.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input 
            type="text"
            name={propertyName}
            className={`w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} 
              rounded-md focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            value={responses[propertyName] || ''}
            onChange={(e) => handleInputChange(propertyName, e.target.value, 'Control')}
            maxLength={150}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{errors[propertyName]}</p>}
          <div className="text-right text-xs text-gray-500 mt-1">
            {responses[propertyName] ? responses[propertyName].length : 0}/150
          </div>
        </div>
      );
    } else if (element.type === 'Number') {
      return (
        <div className={`mb-4 ${errorClass}`} key={propertyName}>
          <label className="block text-gray-700 font-medium mb-2">
            {element.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input 
            type="text"
            name={propertyName}
            className={`w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} 
              rounded-md focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            value={responses[propertyName] || ''}
            onChange={(e) => handleInputChange(propertyName, e.target.value, 'Number')}
            placeholder="Ingrese un valor numérico"
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{errors[propertyName]}</p>}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{questionary.label || "Cuestionario"}</h3>
      
      {attempted && Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Por favor complete todos los campos requeridos</p>
          <ul className="list-disc ml-5 mt-1 text-sm">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        {questionary.elements.map(element => renderElement(element))}
      </div>
      
      <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        <p className="text-sm">Todos los campos marcados con <span className="text-red-500">*</span> son obligatorios.</p>
      </div>
      
      {/* Eliminamos el botón de "Verificar y continuar" */}
    </div>
  );
});

// Asignar un displayName para facilitar la depuración
ServiceQuestionary.displayName = 'ServiceQuestionary';

export default ServiceQuestionary;