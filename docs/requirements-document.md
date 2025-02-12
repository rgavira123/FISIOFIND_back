---
title: "REQUIREMENTS DOCUMENT"
subtitle: "FISIOFIND"                       
author: [Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernandez Caballero, Daniel Alors Romero] 
date: "12/02/2025"                                                 
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: ".backgrounds/background2V.pdf"                            
header-left: "REQUIREMENTS DOCUMENT"                 
header-right: "12/02/2025"                                         
footer-left: "FISIOFIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<!-- <p align="center" style="font-size: 30px; font-weight: bold;">
  FISIOFIND  -  REQUIREMENTS DOCUMENT
</p>

<br>

**Índice**
- [1. INTRODUCCIÓN](#1-introducción)  
    - [1.1. RECOPILACIÓN DE REQUISITOS](#11-recopilación-de-requisitos)  
- [2. ESTRUCTURA DE LOS REQUISITOS](#2-estructura-de-los-requisitos)    
- [3. REQUISITOS](#3-requisitos)
    - [3.1. REQUISITOS FUNCIONALES](#31-requisitos-funcionales)  
    - [3.2. REQUISITOS NO FUNCIONALES](#32-requisitos-no-funcionales)  
    - [3.3. REQUISITOS DE INFORMACIÓN](#33-requisitos-de-información)  -->
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Autores:** Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernandez Caballero, Daniel Alors Romero

- **Fecha de Creación:** 12/02/2025  

- **Versión:** v1.0

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 12/02/2025 | v1.0    | Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernandez Caballero, Daniel Alors Romero          | Añadidos los apartados: Introducción, Estructura de los Requisitos y Requisitos. |

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los requisitos contemplados en el proyecto FisioFind.  

## 1.1. RECOPILACIÓN DE REQUISITOS  
La recopilación de requisitos es un proceso esencial para identificar y definir de manera clara y precisa las expectativas de los usuarios y los objetivos estratégicos del proyecto. Este proceso permite asegurar que el sistema a desarrollar satisfaga completamente las demandas del negocio y de los usuarios finales.  
Para este proyecto, enfocado en la relación entre fisioterpeutas y sus clientes, la recopilación de requisitos se llevará a cabo a través de diversas técnicas, garantizando que cada aspecto relevante sea considerado.  

Métodos de Recopilación: 

- **Reunión entre integrantes del grupo**: Reuniones entre integrantes del grupo: los propios integrantes del grupo realizarán reuniones para definir aquellos requisitos relacionados con aspectos más técnicos de la aplicación.

- **Formularios**: con el fin de acceder a las verdaderas necesidades de los profesionales, se realizan formularios que permiten a los usuarios proporcionar información relevante.  

Definición y Documentación Inicial:  

- Los requisitos recopilados serán organizados en un primer borrador que incluirá tanto requisitos funcionales como no funcionales.  

- Se asegurará que todos los requisitos estén bien definidos y comprendidos por el equipo técnico.  

<br>

# 2. ESTRUCTURA DE LOS REQUISITOS
Primeramente, se hará una separación de requisitos en funcionales, no funcionales y de información, según las siguientes descripciones:  

- **Requisitos funcionales**: Describen las funciones que el sistema debe cumplir para satisfacer las necesidades de los usuarios. Se refieren a las funcionalidades y características visibles que permiten la interacción directa del usuario con el sistema.  

- **Requisitos no funcionales**: Definen atributos de calidad que no están directamente relacionados con las funciones del sistema, pero que son esenciales para su rendimiento. Incluyen aspectos como la seguridad, la escalabilidad, la usabilidad y la eficiencia.  

- **Requisitos de información**: Especifican los datos que el sistema debe gestionar, almacenar, procesar y comunicar para garantizar el cumplimiento de sus funciones.  

Por otro lado, para cada requisito, se define lo siguiente:  

- **Identificador**: dependiendo de si el requisito es funcional o no funcional, contará con un identificador u otro:  

    - **ID requisitos funcionales**: RF-X.  

    - **ID requisitos no funcionales**: RNF-X. 

    - **ID requisitos de información**: RI-X.    

- **Versión**: indica las distintas fases por las que pasa el requisito. Las versión empieza en la V1.0 y va aumentando en función de las modificaciones.  

- **Descripción**: una breve descripción de lo que se busca implementar o tener en cuenta con el requisito. 

- **Prioridad**: se definen cuatro distintas prioridades, de mayor a menor importancia:

    - **Crítica:** Estos son los requisitos esenciales para que la solución funcione y cumpla con los objetivos mínimos del proyecto. Sin ellos, el producto no sería viable o no cumpliría las expectativas.  

    - **Importante:** Estos requisitos son muy deseables y tienen un alto valor añadido, pero no son imprescindibles para la operatividad mínima del sistema. Si no se implementan en la primera fase, el proyecto aún sería funcional, aunque con menos eficiencia o atractivo para el usuario.  

    - **Deseable:** Son requisitos que podrían incluirse si los recursos y el tiempo lo permiten, pero no afectan de manera crítica al éxito del proyecto. Su implementación añade valor adicional o mejora la experiencia del usuario, pero su ausencia no compromete el objetivo principal.  

    - **Baja:** Estos requisitos no se implementarán en el alcance actual del proyecto, ya sea porque no son necesarios o porque no son factibles dentro de los plazos y recursos disponibles. Sin embargo, podrían considerarse para fases futuras o como mejoras posteriores.   

<br>

# 3. REQUISITOS
## 3.1. Requisitos Funcionales
| **RF-01** | **Perfil profesional con certificaciones verificadas**  |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los profesionales registrados en la plataforma deben contar con certificaciones verificadas que acrediten su experiencia y conocimientos. |
| **Prioridad** | Importante |



| **RF-02** | **Agenda integrada con gestión de citas**   |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe incluir una agenda que permita a los profesionales gestionar citas con los pacientes de manera eficiente. |
| **Prioridad** | Crítica |

| **RF-03** |  **Videollamadas con herramientas específicas** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe contar con un sistema de videollamadas que incluya herramientas avanzadas como dibujos en pantalla, opción de presentar pantalla, modelos 3D del cuerpo ("atlas"), libro de ejercicios, cuestionarios de valoración en la consulta y mapa de dolor. |
| **Prioridad** | Crítica |

| **RF-04** | **Mapa de dolor interactivo**  |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe integrar un mapa de dolor interactivo que permita a los pacientes señalar zonas afectadas del cuerpo. Se pueden considerar herramientas como *react-body-highlighter* y *reactjs-human-body*. |
| **Prioridad** | Importante |

| **RF-05** | **Gestión de pagos y facturación automatizada** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe permitir la gestión de pagos y la generación automatizada de facturas para facilitar el proceso administrativo. |
| **Prioridad** | Crítica |

| **RF-06** | **Sistema de valoraciones y comentarios de pacientes**  |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes deben poder dejar valoraciones y comentarios sobre los profesionales y las consultas recibidas. |
| **Prioridad** | Importante |

| **RF-07** | **Seguimiento fuera de consulta con escala EVA** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir el seguimiento del paciente fuera de la consulta mediante la Escala Visual Analógica del Dolor (EVA) para evaluar la evolución de su estado. |
| **Prioridad** | Importante |

| **RF-08** | **Búsqueda y filtrado por especialidad, ubicación y disponibilidad** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder buscar fisioterapeutas utilizando filtros avanzados, tales como especialidad, nombre de la localidad, técnicas, patologías y disponibilidad; además, podrá ordenar los resultados por precio, valoración y distancia, filtrar por tipo de consulta (online, presencial o a domicilio) y visualizar los resultados en un mapa interactivo. |
| **Prioridad** | Crítica |

| **RF-09** | **Seguimiento del tratamiento con recomendaciones personalizadas** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe ofrecer un seguimiento del tratamiento del paciente mediante recomendaciones personalizadas basadas en su evolución y necesidades específicas. |
| **Prioridad** | Importante |

| **RF-10** | **Historial de consultas y posibilidad de agendar sesiones recurrentes** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes deben poder visualizar un historial de sus consultas previas y contar con la opción de agendar sesiones recurrentes con su fisioterapeuta. |
| **Prioridad** | Importante |

| **RF-11** | **Cuestionario predefinido para valoración previa del fisioterapeuta** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Antes de la consulta, el paciente deberá completar un cuestionario con información relevante sobre su condición para que el fisioterapeuta pueda hacer una valoración previa. |
| **Prioridad** | Crítica |

| **RF-12** | **Acceso a plataforma para visualizar ejercicios prescritos y registrar progresos** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes deben tener acceso a la plataforma donde podrán visualizar los ejercicios prescritos con vídeos o descripciones y registrar su dolor, número de series y repeticiones realizadas en comparación con las pautadas. |
| **Prioridad** | Crítica |

| **RF-13** | **Agenda en la plataforma** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer la opción de visualizar la agenda de citas, mostrando de forma diferenciada las consultas online (con enlaces de acceso) y las consultas presenciales (con información de ubicación). |
| **Prioridad** | Importante |

| **RF-14** | **Historial clínico y métodos de anamnesis** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe permitir la gestión del historial clínico de los pacientes, incluyendo métodos de anamnesis para el seguimiento adecuado de su evolución. |
| **Prioridad** | Crítica |

| **RF-15** | **Aceptación de términos y condiciones sobre responsabilidad** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Durante el registro, el paciente debe aceptar en los "Términos y Condiciones" que los daños y perjuicios derivados de la realización autónoma de los ejercicios pautados no son responsabilidad del fisioterapeuta. |
| **Prioridad** | Importante |

| **RF-16** | **Inicio de sesión** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y fisioterapeutas) iniciar sesión mediante correo y contraseña o a través de proveedores de autenticación social (por ejemplo, Google, Facebook, etc.), facilitando el acceso con distintos métodos. |
| **Prioridad** | Crítica |

| **RF-17** | **Cierre de sesión** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y fisioterapeutas) cerrar sesión. |
| **Prioridad** | Crítica |

| **RF-18** | **Gestión de usuarios: listado, edición y eliminación** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los administradores deben poder listar, editar y eliminar usuarios en la plataforma de acuerdo con los permisos asignados. |
| **Prioridad** | Importante |

| **RF-19** | **Recuperación de contraseña** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe ofrecer una opción de recuperación de contraseña mediante correo electrónico para usuarios que la hayan olvidado. |
| **Prioridad** | Importante |

| **RF-20** | **Roles y permisos de usuario** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe diferenciar entre roles de usuario (paciente, fisioterapeuta y administrador) y gestionar los permisos de cada uno para restringir o habilitar funciones según corresponda. |
| **Prioridad** | Crítica |

| **RF-21** | **Verificación de cuenta** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Al registrarse, los usuarios deben confirmar su cuenta a través de un enlace de verificación enviado por correo electrónico. |
| **Prioridad** | Importante |

| **RF-22** | **Eliminación de cuenta** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los usuarios deben poder eliminar su cuenta de forma definitiva, eliminando todos sus datos de la plataforma conforme a la normativa de protección de datos. |
| **Prioridad** | Importante |

| **RF-23** | **Escalas de dolor avanzadas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer diversas escalas de dolor (como EVA, escala de Borg, escala de McGill, etc.) para una evaluación más detallada del estado del paciente. |
| **Prioridad** | Importante |

| **RF-24** | **Compartición de diagnósticos e imágenes** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder compartir diagnósticos, imágenes y resultados de pruebas con los pacientes dentro de la plataforma, permitiendo una mejor comprensión de su condición. |
| **Prioridad** | Importante |

| **RF-25** | **Opción de grabación de videollamadas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir la grabación de las videollamadas para que los pacientes puedan revisarlas posteriormente, asegurando un mejor seguimiento de las recomendaciones del fisioterapeuta. |
| **Prioridad** | Importante |

| **RF-26** | **Explicaciones visuales interactivas de recomendaciones** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe incluir herramientas visuales interactivas que permitan a los fisioterapeutas explicar sus recomendaciones a los pacientes de forma clara y efectiva. |
| **Prioridad** | Importante |

| **RF-27** | **Sistema de mensajería para confirmación de citas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe contar con un sistema de notificación (por mensaje o correo electrónico) que confirme las citas agendadas y envíe recordatorios automáticos, incluyendo notificaciones días previos a la cita. |
| **Prioridad** | Importante |

| **RF-28** | **Perfil profesional completo** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe mostrar un perfil detallado del fisioterapeuta, que incluya: ubicación, reconocimientos, datos de contacto (nombre, teléfono, correo electrónico), multimedia, valoraciones, servicios y especialidades, horario, modalidad de consulta (online, presencial o ambas), métodos de pago y tarifas. |
| **Prioridad** | Importante |

| **RF-29** | **Apartado para profesionales de clínica** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | En el caso de que la plataforma sea utilizada por una clínica, se debe disponer de un apartado específico para gestionar y visualizar a los profesionales que trabajan en la misma. |
| **Prioridad** | Importante |

| **RF-30** | **Sistema de mensajería entre usuarios** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y profesionales) intercambiar mensajes directos para coordinar detalles o resolver dudas previas a la solicitud de citas. |
| **Prioridad** | Deseable |

| **RF-31** | **Reserva con selección de servicio** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Al reservar una cita, el sistema debe permitir al paciente elegir el servicio deseado (por ejemplo, osteopatía, ecografía, masaje, etc.), mostrando el precio, la duración de la consulta y la disponibilidad de fechas para ese servicio. |
| **Prioridad** | Importante |

| **RF-32** | **Sistema de favoritos para profesionales** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los pacientes marcar a los profesionales como favoritos (dar "me gusta"), para acceder rápidamente a sus perfiles y facilitar futuras reservas. |
| **Prioridad** | Baja |

| **RF-33** | **Listado de pacientes para profesionales** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los profesionales deben poder visualizar un listado de sus pacientes, con acceso rápido a datos de contacto, historial de citas y estado del tratamiento. |
| **Prioridad** | Importante |

| **RF-34** | **Agenda clínica con asignación individual de citas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a la clínica programar citas de forma que, al seleccionar una franja horaria, se pueda elegir el profesional específico para cada cita. Esto implica que, en una misma franja horaria, se podrán agendar tantas citas como profesionales estén disponibles, asignando cada una de ellas a un profesional diferente. La agenda deberá reflejar claramente la distribución de citas por profesional para facilitar su gestión y evitar conflictos en la asignación. |
| **Prioridad** | Crítica |

---

<br>

## 3.2 Requisitos No Funcionales

| **RNF-01** | **Requisito de calidad** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe cumplir con al menos los requisitos críticos e importantes. |
| **Prioridad** | Crítica |

| **RNF-02** | **Plataforma web y aplicación móvil** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La solución debe contar con una plataforma web accesible desde navegadores, con soporte para iOS y Android. |
| **Prioridad** | Crítica |

| **RNF-03** | **Multilenguaje** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer soporte en varios idiomas, al menos en español e inglés. |
| **Prioridad** | Deseable |

| **RNF-04** | **Cumplimiento con normativa GDPR/LOPD** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe cumplir con las regulaciones de protección de datos como el GDPR en Europa o la LOPD en España. |
| **Prioridad** | Crítica |

---

<br>

## 3.3 Requisitos de Información

| **RI-01** | **Historial clínico con plantillas personalizables** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder registrar el historial clínico del paciente mediante plantillas personalizables para diferentes tipos de tratamientos y patologías. |
| **Prioridad** | Importante |
