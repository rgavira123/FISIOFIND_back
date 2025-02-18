---
title: "PLANNING SPRINT GENERAL"         # CHANGE IF NEEDED
subtitle: "FISIO FIND"
author: [Antonio Macías Ferrera]          # CHANGE IF NEEDED
date: "15/02/2025"                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "PLANNING SPRINT GENERAL"   # CHANGE IF NEEDED
header-right: "15/02/2025"                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"  
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  SPRINT PLANNING SPRINT X
</h1>

<br>

**ÍNDICE**
1. [OBJETIVOS DEL PROYECTO](#1-objetivos-del-sprint)
2. [METODOLOGÍA INTERNA](#2-metodología-interna)
   - [GESTIÓN DE TAREAS](#21-gestión-de-tareas)
   - [FLUJO DE TRABAJO](#22-flujo-de-desarrollo)
   - [FLUJO DE DESAROLLO](#23-flujo-de-desarrollo)
   - [DEFINICIÓN DE HECHO (DOD)](#24-definición-de-hecho-dod)
   - [GESTIÓN DE LA CONFIGURACIÓN](#25-gestión-de-la-configuración)
   - [GESTIÓN DEL CAMBIO](#26-gestión-del-cambio)
   - [GESTIÓN DE LOS RIESGOS](#27-gestión-de-los-riesgos)
   - [USO DE INTELIGENCIA ARTIFICIAL](#28-uso-de-inteligencia-artificial)
3. [PRODUCT BACKLOG](#3-sprint-backlog)
<!-- COMMENT WHEN EXPORTING TO PDF -->

---


<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Autores:** Antonio Macías Ferrera

- **Fecha de Creación:** 15/02/2025  

- **Versión:** v1.0

<br>

<br>

---

**Historial de modificaciones**

| Fecha      | Versión | Realizada por | Descripción de los cambios |
|------------|---------|--------------|----------------------------|
| 15/02/2025 | v1.0    |  Antonio Macías Ferrera | Elaboración de la base del documento. |

<br>

<!-- \newpage -->

<br>


# **1. OBJETIVOS DEL SPRINT**
El propósito de este informe es definir los objetivos a lograr durante el Sprint #X y describir la metodología para alcanzarlos. Se analizarán el proceso de **Sprint Planning**, la gestión de tareas con **GitHub Project**, y el cumplimiento de las estimaciones iniciales.

Los siguientes **objetivos** del *Sprint* harán referencia a las HU desglosadas en la plataforma *GitHub Project*.

- ✅ **Objetivo 1:** [Descripción breve del objetivo]
- ✅ **Objetivo 2:** [Descripción breve del objetivo]
- ✅ **Objetivo 3:** [Descripción breve del objetivo]

<br>

<!-- \newpage -->

<br>


# **2. METODOLOGÍA INTERNA**

## 2.1. Gestión de Tareas

El equipo utiliza *GitHub Project* como herramienta de gestión de tareas donde las actividades están organizadas en distintas columnas que reflejan su estado dentro del flujo de trabajo. Esta herramienta cuenta con un **tablero Kanban** para facilitar el seguimiento de las tareas, generación de **gráficas Burn-down** que nos serán útiles en las retrospectivas, y asignación y **estimación de tareas** además de otras funciones que procurarán una buena organización del trabajo.

Todas las tareas a ejecutar en el *Sprint* se encontrarán inicialmente en la columna "Product Backlog", habiendo sido previamente asignadas y estimadas por el equipo *Scrum*.

<br>

## 2.2. Flujo de Trabajo

\TODO

<br>

## 2.3. Flujo de Desarrollo

Cada miembro del equipo será responsable de gestionar el estado de sus tareas ateniéndose al siguiente procedimiento:

1. **Inicio de la Tarea**
    - El desarrollador selecciona una tarea de la columna "Product Backlog" y la traslada a "Todo".
    - Esta acción indica que la tarea ha sido priorizada para su ejecución.

2. **Trabajo en Progreso**
    - Cuando se comienza a trabajar en la tarea, se mueve a la columna "In Progress".
    - Se debe registrar el tiempo de trabajo en **Clockify** de acuerdo al protocolo y la política de nombrado especificada en el ***Plan De Gestión De La Configuración***.

3. **Revisión de Código: Revisión por pares**
    - Al finalizar la implementación, el responsable de la tarea crea una *Pull Request (PR)* y traslada la tarea a la columna "In Review".
    - El otro miembro del equipo asignado se encarga de analizar el código y verificar su calidad.
    - Si la revisión es satisfactoria, el revisor aprueba la PR y fusiona los cambios.
    - Si se identifican errores o mejoras necesarias, la tarea se devuelve a "In Progress", notificando los ajustes requeridos.

<br>

## 2.4. Definición De Hecho (DoD) de una Historia de Usuario

Para que una historia de usuario (HU) se considere terminada, debe cumplir con los siguientes requisitos:

- La funcionalidad **debe** estar completamente desarrollada y *cumplir con los requisitos* especificados en la *HU*.

- Se deben **satisfacer** las **expectativas** del producto en términos de **comportamiento y usabilidad**.

- El código **debe seguir las buenas prácticas** establecidas por el equipo.

- Se debe **garantizar** la **legibilidad**, **mantenibilidad** y escalabilidad del código fuente.

- Todo el código **debe ser revisado por al menos un miembro distinto** al desarrollador original.

- El revisor debe verificar que el código funciona correctamente y cumple con los estándares definidos.

- Cada issue debe contar con al menos **un comentario positivo** de otro miembro del equipo antes de su aprobación final.

<br>

## 3.5. Gestión de la Configuración

Desde la **política de versionado** de documentos y de código, hasta la **política de nombrado de ramas**, pasando por el **criterio de mensajes de commits** y el **flujo** de trabajo **GitHub Project - GitHub - Clockify** se encuentra definido en detalle en el ***Plan De Gestión De La Configuración***.

<br>

## 3.6. Gestión del Cambio

\TODO

<br>

## 3.7. Gestión de los Riesgos

\TODO

<br>

## 3.8. Uso de la Inteligencia Artificial

\TODO

<br>
<!-- \newpage -->

<br>


# **3. SPRINT BACKLOG**

| Objetivo | ID | Funcionalidad |
|----------|----|--------------|
| Objetivo 1 | HU-XXX | Implementación del login con autenticación |
| Objetivo 1 | HU-XXX | Integración de API externa |
| Objetivo 2 | HU-XXX | Diseño del dashboard de usuario |
| Objetivo 2 | HU-XXX | CRUD 1 |
| Objetivo 3 | HU-XXX | Datos de clases |

