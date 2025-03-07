---
title: "MID TERM RETROSPECTIVE - SPRINT 1 (21/02-06/03)"       # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #X"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "06/03/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background4V.pdf"  # CHANGE IF NEEDED
header-left: "MID TERM RETROSPECTIVE"                            # CHANGE IF NEEDED
header-right: "06/03/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  MID TERM RETROSPECTIVE SPRINT 1
</h1>

<br>


**ÍNDICE**
1. [PROYECTOS](#1-proyectos)  
    1.1 [DEFINICIÓN DE CADA PROYECTO](#11-definición-de-cada-proyecto)  
    1.2 [PROYECTOS REALIZADOS EN LA SEMANA](#12-proyectos-realizados-en-la-semana)
    1.3 [PROYECTOS DESTACADOS](#13-proyectos-destacados)
2. [HORAS TOTALES](#2-horas-totales)
3. [DESGLOSE](#3-desglose)  
    3.1 [DESGLOSE POR DÍAS](#31-desglose-por-días)  
    3.2 [DESGLOSE POR PROYECTOS](#32-desglose-por-proyectos)  
    3.3 [DESGLOSE POR INTEGRANTES](#33-desglose-por-integrantes)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---


**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #S1

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Benjamín Ignacio Maureira Flores, Daniel Alors Romero

- **Fecha de Creación:** 06/03/2025  

- **Versión:** v1.0

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 06/03/2025 | v1.0    | Benjamín Ignacio Maureira Flores, Daniel Alors Romero, Miguel Encina Martínez, Francisco Mateos Villarejo | Elaboración de la primera versión del documento |

<br>

<!-- \newpage -->

<br>


# 1. INFORMACIÓN DEL ESTUDIO QA

| Alumno | Dedicación | Compensación | Disponibilidad | Compromiso | Prácticas | Valoración Final | 
| ------ | ---------- | ------------ | -------------- | ---------- | --------- | ---------------- |
| Alberto Carmona Sicre | 30% | X | 10% | 30% | 30% | E |
| Antonio Macías Ferrera | 30% | X | 10% | 30% | 30% | E |
| Benjamín Ignacio Maureira Flores | 30% | X | 10% | 30% | 30% | E |
| Francisco Capote García | 30% | X | 10% | 30% | 30% | E |
| Daniel Alors Romero | 30% | X | 8% | 30% | 30% | E |
| Daniel Fernández Caballero | 30% | X | 10% | 30% | 30% | E |
| Daniel Ruíz López | 30% | X | 10% | 30% | 30% | E |
| Daniel Tortorici Bartús | 30% | X | 10% | 28% | 30% | E |
| Daniel Vela Camacho | 30% | X | 10% | 30% | 30% | E |
| Delfín Santana Rubio | 30% | X | 10% | 30% | 30% | E |
| Guadalupe Ridruejo Pineda | 30% | X | 10% | 30% | 30% | E |
| Julen Redondo Pacheco | 30% | X | 10% | 30% | 30% | E |
| Miguel Encina Martínez | 30% | X | 10% | 30% | 30% | E |
| Francisco Mateos Villarejo | 30% | X | 10% | 30% | 30% | E |
| Pablo Fernández Pérez | 30% | X | 10% | 30% | 30% | E |
| Ramón Gavira Sánchez | 30% | X | 10% | 30% | 30% | E |
| Rafael Pulido Cifuentes | 30% | X | 10% | 28% | 30% | E |

<br>

# 2. PROBLEMAS ENCONTRADOS

En esta sección analizaremos los problemas encontrados durante las dos primeras semanas de trabajo, su impacto, las decisiones tomadas y su trazabilidad con los riesgos identificados durante la planificación del proyecto.

| Problema encontrado | Descripción | ¿Cómo se ha resuelto? | Riesgo relacionado | Estado | 
| ------------------- | ----------- | --------------------- | ------------------ | ------ |
| Tecnologías desconocidas en frontend | Para implementar funcionalidades como la videollamada o el calendario interactivo, se han hecho uso de herramientas desconocidas y de nivel avanzado | Se ha realizado un esfuerzo para formarse en dichas tecnologías con el fin de completar las tareas en el tiempo establecido | RIG-004 | Solucionado |
| Diversidad de los modelos de almacenamiento de los colegios de fisioterapeutas | Para verificar si un fisioterapeuta está colegiado, se ha requerido hacer *scrapping* a las páginas oficiales de los colegios de fisioterapia de todas las comunidades autónomas que almacenaban diferentes datos de los fisioterapeutas. | Se ha tenido que crear un modelo diferente para cada uno. | RIG-006 | Solucionado |
| Dependencia de tareas necesarias para completar otras tareas | Algunas tareas dependían de otras tareas que se han retrasado, lo que el retraso de solo una tarea ha llevado al retraso de varias. | Añadir recursos a las tareas críticas | N/A | Solucionado

# 3. RELOJ DEL AVANCE DEL PROYECTO 
![Reloj de avance del proyecto](../../.img/reloj_de_avance_proyecto_06-03-2025.png)

Como podemos observar, en estas primeras semanas vamos por encima del tiempo estimado propuesto de 170 horas semanales debido a que en la segunda semana se hizo un extra esfuerzo debido a que hubo un cambio de idea y hubo que realizar el trabajo de dos semanas en una única.

---

**Aprobado por:**  
**Scrum Master:** Antonio Macías Ferrera