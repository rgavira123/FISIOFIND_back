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
  - [2.1. CLASIFICACIÓN DE RIESGOS](#2.1-clasificación-de-riesgos)
  - [2.2. LISTADO DE RIESGOS](#2.2-listado-de-riesgos)

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Autores:** Delfín Santana Rubio

- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.1

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 16/02/2025 | v1.0    | Delfín Santana Rubio          | Creación del documento y primeras modificaciones |
| 17/02/2025 | v1.0    | Delfín Santana Rubio          | Añadido impacto, probabilidad y factor a los riesgos, creación del punto 2.1 y añadidos más riesgos |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los riesgos contemplados en el proyecto FisioFind.  

# 2. RIESGOS

## 2.1 CLASIFICACIÓN DE RIESGOS
Se ha seguido la clasificación mostrada en la píldora teórica "ISPP - Sesión 02a":
- Estimación.
- Técnico.
- Requisitos: Por ejemplo, que surja un nuevo requisito.
- Organizacional: Problemas en la organización interna.
- Internos.
- Internos-externos.

## 2.2 LISTADO DE RIESGOS

| **RIG-001** | **Filtrado de datos médicos**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Dado que esta aplicación maneja datos médicos, existe el riesgo de que estos se filtren(ya sea por brecha de seguridad, mal manejo de permisos, etc.). Esto es un problema ya que la regulación actual de protección de datos penaliza gravemente este tipo de sucesos. |
| **Clasificación** | Internos-externos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 3<br>10<br>30 |
| **Prioridad** | 10|
| **Contramedidas actuales** | Implementar las medidas de seguridad necesarias: cifrado, herramientas de escaneo de código en búsqueda de vulnerabilidades, etc. |
| **Plan de contingencia** | Se entiende que es un riesgo que no podemos dejar que suceda. De suceder, siguiendo el GDPR y la LOPD tendríamos que notificar la brecha de seguriar a Incibe y aceptar las consecuencias legales. No tenemos capacidad para hacer una investigación de seguridad sobre incidentes de este tipo. |

| **RIG-002** | **Surgen nuevas necesidades para los fisioterapeutas**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe la posibilidad de que surja la necesidad de una nueva herramienta para las consultas telemáticas. |
| **Clasificación** | Requisitos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 5<br>7<br>35 |
| **Prioridad** | 7|
| **Contramedidas actuales** | Implementar un buen plan de Gestión de Cambios. |
| **Plan de contingencia** | Seguir el plan de gestión de cambios. |

| **RIG-003** | **Competidores**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe la posibilidad de que los competidore que tienen algunas funcionalidades que tiene FISIO FIND, implementen las mismas que tiene FISIO FIND. |
| **Clasificación** | Externos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 5<br>8<br>40 |
| **Prioridad** | 6 |
| **Contramedidas actuales** | Seguir haciendo análisis de competidores periódicamente. |
| **Plan de contingencia** | A partir del análisis de competidores periódico, buscar nuevas debilidades en el mercado para volver a ser innovadores. |

| **RIG-004** | **Problemas al implementar un requisito novedoso**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad que alguna de las herramientas o funcionalidades que quiere implementar el equipo de FISIO FIND sea suficientemente difícil de implementar como para que ocurra un retraso en uan entrega o no pueda implementarse.  |
| **Clasificación** | Requisitos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 3<br>6<br>18 |
| **Prioridad** | 7 |
| **Contramedidas actuales** | Investigar sobre las tecnologías necesarias para cumplir con un requisito antes de asegurarlo. |
| **Plan de contingencia** | De descubrirse una funcionalidad o herramienta difícil de implementar, se destinarán más recursos para desarrollarla. |
