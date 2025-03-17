'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import styles from '../css/AnatomicalModel.css'; // Ajusta la ruta si es necesario

// Componente interno para el modelo 3D
const Model = ({ url, selectedPart, onPartSelect, wireframe }) => {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  
  const model = React.useMemo(() => scene.clone(), [scene]);
  
  useEffect(() => {
    model.traverse((object) => {
      if (object.isMesh) {
        object.material.transparent = true;
        object.material.opacity = 1;
        object.material.wireframe = wireframe;
        
        if (selectedPart && object.name === selectedPart) {
          object.material.emissive.set(0x0088ff);
          object.material.emissiveIntensity = 0.5;
        } else {
          object.material.emissive.set(0x000000);
          object.material.emissiveIntensity = 0;
        }
        
        object.userData.clickable = true;
        object.userData.name = object.name;
      }
    });
  }, [model, selectedPart, wireframe]);

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        if (e.object.userData.clickable) {
          e.stopPropagation();
          onPartSelect(e.object.userData.name);
        }
      }}
    >
      <primitive object={model} />
    </group>
  );
};

const AnatomicalModel = ({ isVisible, userRole }) => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [wireframe, setWireframe] = useState(false);

  // Modelos disponibles (solo el que tienes por ahora)
  const models = [
    { id: 1, name: "Cuerpo completo", url: "/models/ecorche_-_anatomy_study.glb" },
    // Puedes agregar más modelos aquí si los descargas después
  ];
  
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handlePartSelect = (partName) => {
    setSelectedPart(partName);
  };

  const toggleWireframe = () => {
    setWireframe(!wireframe);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.toolPanel}>
      <div className={styles.toolPanelHeader}>
        <h3>Modelo Anatómico 3D</h3>
      </div>
      
      <div className={styles.toolPanelContent}>
        {/* Selector de modelo */}
        <div className={styles.controlsRow}>
          <select 
            value={selectedModel.id} 
            onChange={(e) => {
              const modelId = parseInt(e.target.value);
              const model = models.find(m => m.id === modelId);
              setSelectedModel(model);
            }}
            className={styles.selectControl}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          
          <button 
            onClick={toggleWireframe} 
            className={styles.controlButton}
          >
            {wireframe ? 'Modo Normal' : 'Modo Wireframe'}
          </button>
        </div>
        
        {/* Canvas para el modelo 3D */}
        <div className={styles.modelContainer} style={{ height: '400px' }}>
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            
            <Model 
              url={selectedModel.url}
              selectedPart={selectedPart}
              onPartSelect={handlePartSelect}
              wireframe={wireframe}
            />
            
            <OrbitControls makeDefault />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default AnatomicalModel;