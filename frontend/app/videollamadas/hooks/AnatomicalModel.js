'use client';

import React, { useState } from 'react';
import styles from '../css/AnatomicalModel.css';

const AnatomicalModel = ({ isVisible }) => {
  const [wireframe, setWireframe] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  if (!isVisible) return null;

  // Reemplaza este URL con el enlace embedido de tu modelo en Sketchfab
  const sketchfabEmbedUrl = "https://sketchfab.com/models/e402d3d541eb4b199c57d5410f5d3c57/embed?autostart=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0";

  return (
    <div className={styles.anatomicalModelContainer}>
      <div className={styles.modelControls}>
        <select className={styles.modelSelector}>
          <option value="1">Cuerpo completo</option>
        </select>
        <button
          className={`${styles.controlButton} ${wireframe ? styles.activeButton : ''}`}
          onClick={() => setWireframe(!wireframe)}
        >
          {wireframe ? 'Modo Normal' : 'Modo Wireframe'}
        </button>
      </div>

      <div className={styles.canvasContainer}>
        {/* Embedir el modelo con un iframe */}
        <iframe
          title="Sketchfab Model"
          src={sketchfabEmbedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; vr"
          allowFullScreen
          style={{ minHeight: '500px' }}
        ></iframe>

        <div className={styles.annotations}>
          <h3>Parte seleccionada</h3>
          <p>{selectedAnnotation ? selectedAnnotation.details : 'Selecciona una parte del modelo para ver detalles.'}</p>
        </div>
      </div>
    </div>
  );
};

export default AnatomicalModel;