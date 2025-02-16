---
title: "REGISTRO DE RIESGOS"
subtitle: "FISIOFIND"                       
author: [Delfín Santana Rubio] 
date: "16/02/2025"                                                 
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"                            
header-left: "REGISTRO DE RIESGOS"                 
header-right: "16/02/2025"                                         
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REGISTRO DE RIESGOS
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)   
- [2. RIESGOS](#2-riesgos)   

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Autores:** Delfín Santana Rubio

- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.0

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 16/02/2025 | v1.0    | Delfín Santana Rubio          | Creación del documento y primeras modificaciones |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los riesgos contemplados en el proyecto FisioFind.  

# 2. RIESGOS

| **RIG-001** | **Filtrado de datos médicos**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Dado que esta aplicación maneja datos médicos, existe el riesgo de que estos se filtren. Esto es un problema ya que la regulación actual de protección de datos penaliza gravemente este tipo de sucesos. |
| **Prioridad** | Crítica |
| **Contramedidas** | Implementar las medidas de seguridad necesarias: cifrado, herramientas de escaneo de código en búsqueda de vulnerabilidades, etc. |

| **RIG-002** | **Surgen nuevas necesidades para los fisioterapeutas**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad de que surja la necesidad de una nueva herramienta para las consultas telemáticas. |
| **Prioridad** | Media |
| **Contramedidas** | Implementar un buen plan de Gestión de Cambios. |

| **RIG-003** | **Competidores**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad de que los competidore que tienen algunas funcionalidades que tiene FISIO FIND, implementen las mismas que tiene FISIO FIND. |
| **Prioridad** | Crítica |
| **Contramedidas** | Seguir haciendo un análisis de competidores periódicamente. |
