---
title: "REGISTRO DE RIESGOS"
subtitle: "FISIO FIND"                       
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
- [2. LISTADO DE RIESGOS](#2-listado-de-riesgos)

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** Fisio Find

- **Autores:** Delfín Santana Rubio

- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.2

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 16/02/2025 | v1.0    | Delfín Santana Rubio          | Creación del documento y primeras modificaciones |
| 17/02/2025 | v1.1    | Delfín Santana Rubio          | Añadido impacto, probabilidad y factor a los riesgos, creación del punto 2.1 y añadidos más riesgos |
| 17/02/2025 | v1.2    | Delfín Santana Rubio          | Añadidos más riesgos y movido punto 2.1 al plan de gestión de requisitos  |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los riesgos contemplados en el proyecto FISIO FIND.  

# 2. LISTADO DE RIESGOS

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
| **Descripción** | Existe la posibilidad de que alguna de las herramientas o funcionalidades que quiere implementar el equipo de FISIO FIND sea suficientemente difícil de implementar como para que ocurra un retraso en uan entrega o no pueda implementarse.  |
| **Clasificación** | Técnicos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 3<br>6<br>18 |
| **Prioridad** | 7 |
| **Contramedidas actuales** | Investigar sobre las tecnologías necesarias para cumplir con un requisito antes de asegurarlo. |
| **Plan de contingencia** | De descubrirse una funcionalidad o herramienta difícil de implementar, se destinarán más recursos para desarrollarla. |

| **RIG-005** | **El usuario no entiende la interfaz**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad de que el usuario no sepa utilizar la aplicación.  |
| **Clasificación** | Externos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 3<br>5<br>15 |
| **Prioridad** | 7 |
| **Contramedidas actuales** | Se deberá de hacer la aplicación lo más intuitiva posible y evaluar el grado de usabilidad y satisfacción en las encuestas pasadas a los usuarios piloto. |
| **Plan de contingencia** | De descubrirse de alguna forma que esto está sucediendo, se deberá de pedir al usuario final de forma más clara que ofrezca su feedback. Por ejemplo, añadiendo una mensaje en la pantalla de inicio que anime a dar feedback de la aplicación. |

| **RIG-006** | **Los medios para comprobar que un fisio está colegiado dejan de estar disponibles**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad de que los medios que FISIO FIND utiliza para comprobar si un fisio esté o no colegiado dejen de estar disponibles. Por ejemplo, actualmente esto se comprueba a través de las webs públicas de los colegiados. Si por ejemplo, una nueva ley de protección hace que estas páginas deban de dejar de ser públicas, nuestros mecanismos para comprobar que un fisio está colegiado quedarían inoperativos.  |
| **Clasificación** | Técnicos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 1<br>9<br>9 |
| **Prioridad** | 6 |
| **Contramedidas actuales** | Se deberá de estar a la orden del día en cuanto a legislación de protección de datos y a las noticias que esten relacionadas de alguna forma con este riesgo. Debido a la poca probabilidad de que suceda algo así, esto se hará de forma informal por el equipo, sin necesidad de que quede registrado. |
| **Plan de contingencia** | De suceder este riesgo, se buscarán formas alternativas para verficar que un fisio está colegiado. Debido a que se entiende de que los fisios siempre van a tener la necesidad de ser capaces de verificar que están colegiados, simplemente se deberá de estudiar la forma de digitalizar y automatizar este proceso lo máximo posible. |

| **RIG-007** | **Las tecnologías utilizadas dejan de estar mantenidas**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad de que alguna de las tecnologías que se utilizan para el desarrollo de la aplicación dejen de ser mantenidas. Esto es un problema desde el punto de vista de la seguridad y del arreglo de bugs.  |
| **Clasificación** | Técnicos |
| **Probabilidad**<br>**Impacto**<br>**Factor** | 1<br>6<br>6 |
| **Prioridad** | 5 |
| **Contramedidas actuales** | Se deberán de utilizar tecnologías que lleven el suficiente tiempo siendo mantenidas y que tengan una amplia comunidad. |
| **Plan de contingencia** | Se deberá de estudiar los pros y contras de seguir utilando el software no mantenido, cambiar a otro software y de que el equipo de FISIO FIND dedique recursos para ellos mismos mantener el software, para así tomar la decisión más adecuada. |
