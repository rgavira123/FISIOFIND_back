import React from 'react';
import styles from './Room.module.css';

// Subcomponentes de cada herramienta
import Historial from './tools/Historial';
import AnatomicalModel from './hooks/AnatomicalModel'; // Ajusta la ruta
import Plantillas from './tools/Plantillas';
import Cuestionarios from './tools/Cuestionarios';

const ToolPanel = ({
  selectedTool,
  activePainMap,
  handlePainMapSelect,
  sendPainMapToPatient,
  userRole // Añadido para pasarlo a AnatomicalModel
}) => {
  if (!selectedTool) return null;

  return (
    <div className={styles.toolContent}>
      {selectedTool === 'historial' && <Historial />}
      {selectedTool === 'modelo3d' && (
        <AnatomicalModel isVisible={true} userRole={userRole} />
      )}
      {selectedTool === 'plantillas' && (
        <Plantillas
          activePainMap={activePainMap}
          handlePainMapSelect={handlePainMapSelect}
          sendPainMapToPatient={sendPainMapToPatient}
        />
      )}
      {selectedTool === 'cuestionarios' && <Cuestionarios />}
    </div>
  );
};

export default ToolPanel;