---
title: "REGISTRO DE REQUISITOS"                           # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "12/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "REGISTRO DE REQUISITOS"                     # CHANGE IF NEEDED
header-right: "12/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REGISTRO DE REQUISITOS
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
  - [1.1. Recopilación de requisitos](#11-recopilación-de-requisitos)
- [2. ESTRUCTURA DE LOS REQUISITOS](#2-estructura-de-los-requisitos)
- [3. REQUISITOS](#3-requisitos)
  - [3.1. Requisitos Funcionales](#31-requisitos-funcionales)
  - [3.2 Requisitos No Funcionales](#32-requisitos-no-funcionales)
  - [3.3 Requisitos de Información](#33-requisitos-de-información)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateo Villalba, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernández Caballero, Daniel Alors Romero

- **Fecha de Creación:** 12/02/2025  

- **Versión:** v1.3

<br>

---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 12/02/2025 | v1.0    | Alberto Carmona Sicre, Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernández Caballero, Daniel Alors Romero          | Añadidos los apartados: Introducción, Estructura de los Requisitos y Requisitos. |
| 12/02/2025 | v1.1    | Alberto Carmona Sicre, Daniel Fernández Caballero       | Modificado el apartado de requisitos funcionales |
| 12/02/2025 | v1.2    | Daniel Alors Romero       | Modificados los apartados de requisitos funcionales y no funcionales  |
| 12/02/2025 | v1.3    | Daniel Fernández Caballero      | Añadidos nuevos requisitos funcionales, editados los requisitos funcionales 6, 7, 12, y 23 y añadidos nuevos requisitos no funcionales  |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los requisitos contemplados en el proyecto FisioFind.  

## 1.1. Recopilación de requisitos  
La recopilación de requisitos es un proceso esencial para identificar y definir de manera clara y precisa las expectativas de los usuarios y los objetivos estratégicos del proyecto. Este proceso permite asegurar que el sistema a desarrollar satisfaga completamente las demandas del negocio y de los usuarios finales.  
Para este proyecto, enfocado en la relación entre fisioterapeutas y sus clientes, la recopilación de requisitos se llevará a cabo a través de diversas técnicas, garantizando que cada aspecto relevante sea considerado.  

Métodos de Recopilación: 

- **Reunión entre integrantes del grupo**: Reuniones entre integrantes del grupo: los propios integrantes del grupo realizarán reuniones para definir aquellos requisitos relacionados con aspectos más técnicos de la aplicación.

- **Formularios**: con el fin de acceder a las verdaderas necesidades de los profesionales, se realizan formularios que permiten a los usuarios proporcionar información relevante.  

Definición y Documentación Inicial:  

- Los requisitos recopilados serán organizados en un primer borrador que incluirá tanto requisitos funcionales como no funcionales.  

- Se asegurará que todos los requisitos estén bien definidos y comprendidos por el equipo técnico.  

<br>

<hr>

# 2. ESTRUCTURA DE LOS REQUISITOS
Primeramente, se hará una separación de requisitos en funcionales, no funcionales y de información, según las siguientes descripciones:  

- **Requisitos funcionales**: Describen las funciones que el sistema debe cumplir para satisfacer las necesidades de los usuarios. Se refieren a las funcionalidades y características visibles que permiten la interacción directa del usuario con el sistema.  

- **Requisitos no funcionales**: Definen atributos de calidad que no están directamente relacionados con las funciones del sistema, pero que son esenciales para su rendimiento. Incluyen aspectos como la seguridad, la escalabilidad, la usabilidad y la eficiencia.  

- **Requisitos de información**: Especifican los datos que el sistema debe gestionar, almacenar, procesar y comunicar para garantizar el cumplimiento de sus funciones.  

Por otro lado, para cada requisito, se define lo siguiente:  

- **Identificador**: dependiendo de si el requisito es funcional o no funcional, contará con un identificador u otro:  

    - **ID requisitos funcionales**: RF-XXX.  

    - **ID requisitos no funcionales**: RNF-XXX. 

    - **ID requisitos de información**: RI-XXX.    

- **Versión**: indica las distintas fases por las que pasa el requisito. La versión empieza en la V1.0 y va aumentando en función de las modificaciones.  

- **Descripción**: una breve descripción de lo que se busca implementar o tener en cuenta con el requisito. 

- **Prioridad**: se definen cuatro distintas prioridades, de mayor a menor importancia:

    - **Crítica:** Estos son los requisitos esenciales para que la solución funcione y cumpla con los objetivos mínimos del proyecto. Sin ellos, el producto no sería viable o no cumpliría las expectativas.  

    - **Importante:** Estos requisitos son muy deseables y tienen un alto valor añadido, pero no son imprescindibles para la operatividad mínima del sistema. Si no se implementan en la primera fase, el proyecto aún sería funcional, aunque con menos eficiencia o atractivo para el usuario.  

    - **Deseable:** Son requisitos que podrían incluirse si los recursos y el tiempo lo permiten, pero no afectan de manera crítica al éxito del proyecto. Su implementación añade valor adicional o mejora la experiencia del usuario, pero su ausencia no compromete el objetivo principal.  

    - **Baja:** Estos requisitos no se implementarán en el alcance actual del proyecto, ya sea porque no son necesarios o porque no son factibles dentro de los plazos y recursos disponibles. Sin embargo, podrían considerarse para fases futuras o como mejoras posteriores.   

<br>

<!-- \newpage -->

<hr>

# 3. REQUISITOS
## 3.1. Requisitos Funcionales

| **RF-001** | **Perfil profesional con certificaciones verificadas**  |
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Los fisioterapeutas registrados en la plataforma deben verificar su perfil adjuntando certificaciones validadas que acrediten su experiencia y conocimientos. |
| **Prioridad** | Importante |

| **RF-002** | **Agenda integrada con gestión de citas**   |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe incluir una agenda que permita a los profesionales gestionar citas con los pacientes de manera eficiente. |
| **Prioridad** | Crítica |

| **RF-003** |  **Videollamadas con herramientas específicas** | 
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La aplicación debe contar con un sistema de videollamadas que incluya herramientas avanzadas como dibujos en pantalla, opción de presentar pantalla, libro de ejercicios, cuestionarios de valoración en la consulta y mapa de dolor. |
| **Prioridad** | Crítica |

| **RF-004** | **Mapa de dolor interactivo**  |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe integrar un mapa de dolor interactivo que permita a los pacientes señalar zonas afectadas del cuerpo. Se pueden considerar herramientas como *react-body-highlighter* y *reactjs-human-body*. |
| **Prioridad** | Importante |

| **RF-005** | **Gestión de pagos y facturación automatizada** |
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La aplicación debe permitir la gestión de pagos a través de métodos comunes (tarjetas de crédito, transferencias bancarias, plataformas como PayPal u otros métodos de pago relevantes), así como la generación automatizada de facturas para cada transacción realizada, facilitando los datos del proveedor, cliente, el importe de la factura y comentarios adicionales. |
| **Prioridad** | Crítica |

| **RF-006** | **Valoración y comentarios de pacientes**  |
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La plataforma debe permitir a los pacientes valorar y dejar comentarios sobre los fisioterapeutas y las consultas recibidas. Las valoraciones deben ser visibles en el perfil del fisioterapeuta y servir como referencia para otros pacientes. Los comentarios deben ser moderados para garantizar que sean respetuosos y relevantes. |
| **Prioridad** | Importante |

| **RF-007** | **Seguimiento del progreso del paciente** |
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La plataforma debe ofrecer herramientas para que los fisioterapeutas puedan realizar un seguimiento del progreso de sus pacientes, incluyendo la evolución de su condición, el cumplimiento del tratamiento, los resultados de evaluaciones y tests, etc. Esta información debe ser accesible tanto para el fisioterapeuta como para el paciente y permitir la generación de informes de progreso. |
| **Prioridad** | Deseable |

| **RF-008** | **Búsqueda y filtrado por especialidad, ubicación y disponibilidad** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder buscar fisioterapeutas utilizando filtros avanzados, tales como especialidad, nombre de la localidad, técnicas, patologías y disponibilidad; además, podrá ordenar los resultados por precio, valoración y distancia, filtrar por tipo de consulta (online, presencial o a domicilio) y visualizar los resultados en un mapa interactivo. |
| **Prioridad** | Deseable |

| **RF-009** | **Historial de consultas y posibilidad de agendar sesiones** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes deben poder visualizar un historial de sus consultas previas y contar con la opción de agendar sesiones con su fisioterapeuta, a espera de confirmación de este último. |
| **Prioridad** | Importante |

| **RF-010** | **Cuestionario predefinido para valoración previa del fisioterapeuta** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Antes de la consulta, el paciente deberá completar un cuestionario con información relevante sobre su condición para que el fisioterapeuta pueda hacer una valoración previa. |
| **Prioridad** | Crítica |

| **RF-011** | **Acceso a plataforma para visualizar ejercicios prescritos y registrar progresos** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes deben tener acceso a la plataforma donde podrán visualizar los ejercicios prescritos con vídeos o descripciones y registrar su dolor, número de series y repeticiones realizadas en comparación con las pautadas. |
| **Prioridad** | Crítica |

| **RF-012** | **Agenda en la plataforma** |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La agenda debe permitir visualizar las citas programadas, mostrando detalles importantes como la fecha, hora, tipo de consulta (online o presencial) y el estado de la cita (pendiente, confirmada, cancelada, etc.). Esta visualización debe ser clara e intuitiva para facilitar la gestión de citas tanto para pacientes como para fisioterapeutas. |
| **Prioridad** | Importante |

| **RF-013** | **Inicio de sesión y autenticación social** |
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La plataforma debe permitir que los pacientes inicien sesión mediante proveedores sociales (Google, Facebook, etc.) o mediante correo y contraseña. En el caso de los fisioterapeutas, sus cuentas deberán ser creadas de manera manual por ellos usando la propia aplicación, y se les proporcionarán las credenciales para su acceso, sin la necesidad de autenticación mediante proveedores externos. |
| **Prioridad** | Crítica |

| **RF-014** | **Cierre de sesión** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y fisioterapeutas) cerrar sesión. |
| **Prioridad** | Crítica |

| **RF-015** | **Gestión de usuarios: listado, edición y eliminación** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los administradores deben poder listar, editar y eliminar usuarios en la plataforma de acuerdo con los permisos asignados. |
| **Prioridad** | Importante |

| **RF-016** | **Recuperación de contraseña** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe ofrecer una opción de recuperación de contraseña mediante correo electrónico para usuarios que la hayan olvidado. |
| **Prioridad** | Importante |

| **RF-017** | **Roles y permisos de usuario** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe diferenciar entre roles de usuario (paciente, fisioterapeuta y administrador) y gestionar los permisos de cada uno para restringir o habilitar funciones según corresponda. |
| **Prioridad** | Crítica |

| **RF-018** | **Verificación de la cuenta** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los usuarios deben poder verificar su cuenta mediante un enlace de confirmación enviado por correo electrónico y eliminar su cuenta de forma definitiva, eliminando todos sus datos conforme a la normativa de protección de datos. |
| **Prioridad** | Importante |

| **RF-019** | **Eliminación de cuenta** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los usuarios deben poder eliminar su cuenta mediante un enlace de confirmación enviado por correo electrónico, borrando todos sus datos conforme a la normativa de protección de datos. |
| **Prioridad** | Importante |

| **RF-020** | **Escalas de dolor avanzadas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer diversas escalas de dolor (como EVA, escala de Borg, escala de McGill, etc.) para una evaluación más detallada del estado del paciente. |
| **Prioridad** | Importante |

| **RF-021** | **Compartición de diagnósticos e imágenes** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder compartir diagnósticos, imágenes y resultados de pruebas con los pacientes dentro de la plataforma, permitiendo una mejor comprensión de su condición. |
| **Prioridad** | Importante |

| **RF-022** |  **Gestión de videollamadas** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los fisioterapeutas iniciar y grabar las videollamadas con los pacientes en el horario previamente agendado para la consulta, garantizando una comunicación fluida y segura. |
| **Prioridad** | Crítica |

| **RF-023** | **Sistema de notificaciones y alertas sobre citas** |
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | La plataforma debe contar con un sistema de notificaciones y alertas que informe a los usuarios sobre eventos importantes relacionados con sus citas, como recordatorios de citas próximas, confirmaciones de reserva, cancelaciones, modificaciones, etc.|
| **Prioridad** | Importante |

| **RF-024** | **Perfil profesional completo** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe mostrar un perfil detallado del fisioterapeuta, que incluya: ubicación, reconocimientos, datos de contacto (nombre, teléfono, correo electrónico), multimedia, valoraciones, servicios y especialidades, horario, modalidad de consulta (online, presencial o ambas), métodos de pago y tarifas. |
| **Prioridad** | Importante |

| **RF-025** | **Apartado para profesionales de clínica** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | En el caso de que la plataforma sea utilizada por una clínica, se debe disponer de un apartado específico para gestionar y visualizar a los profesionales que trabajan en la misma. |
| **Prioridad** | Baja |

| **RF-026** | **Características de reserva de citas** | 
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Al reservar una cita, el sistema debe permitir al paciente elegir las fechas e intervalo de horario disponibles y mostrar el precio para ese servicio. |
| **Prioridad** | Importante |

| **RF-027** | **Sistema de favoritos para profesionales** | 
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los pacientes marcar a los profesionales como favoritos (dar "me gusta"), para acceder rápidamente a sus perfiles y facilitar futuras reservas. |
| **Prioridad** | Baja |

| **RF-028** | **Sistema de mensajería entre usuarios** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y profesionales) intercambiar mensajes directos para coordinar detalles o resolver dudas previas a la solicitud de citas. |
| **Prioridad** | Crítica |

| **RF-029** | **Listado de pacientes para profesionales** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los profesionales deben poder visualizar un listado de sus pacientes, con acceso rápido a datos de contacto, historial de citas y estado del tratamiento. |
| **Prioridad** | Importante |

| **RF-030** | **Agenda clínica con asignación individual de citas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a la clínica programar citas de forma que, al seleccionar una franja horaria, se pueda elegir el profesional específico para cada cita. Esto implica que, en una misma franja horaria, se podrán agendar tantas citas como profesionales estén disponibles, asignando cada una de ellas a un profesional diferente. La agenda deberá reflejar claramente la distribución de citas por profesional para facilitar su gestión y evitar conflictos en la asignación. |
| **Prioridad** | Baja |

| **RF-031** | **Integración de modelo 3D del cuerpo en videollamadas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir la visualización e interacción con un modelo 3D del cuerpo humano (atlas) durante las videollamadas. Esta funcionalidad facilitará la comunicación entre el fisioterapeuta y el paciente, permitiendo señalar, rotar y resaltar áreas específicas del cuerpo. |
| **Prioridad** | Deseable |

| **RF-032** | **Planes para fisioterapeutas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas podrán elegir entre dos tipos de planes según el precio que paguen: el "Plan de Fisio Básico" y el "Plan de Fisio Premium". Ambos planes ofrecen las mismas opciones para las consultas, pero el "Plan de Fisio Premium" ofrecerá ventajas adicionales en términos de visibilidad dentro de la plataforma. Esto incluye prioridad en las búsquedas, la posibilidad de crear anuncios para promocionar sus servicios, junto a otros beneficios. |
| **Prioridad** | Importante |

| **RF-033** | **Búsqueda de profesionales en mapa interactivo** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los pacientes buscar los profesionales cercanos en la ciudad a través de un mapa interactivo, mejorando la interactividad en la búsqueda de fisioterapeutas. |
| **Prioridad** | Deseable |

| **RF-034** | **Acceso a la plataforma para usuarios invitados** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir el acceso a usuarios invitados, tanto pacientes como fisioterapeutas, con funcionalidades limitadas. Los usuarios invitados podrán explorar perfiles de fisioterapeutas, servicios y demás información relevante, pero no podrán realizar acciones que requieran registro, como reservar citas o contactar directamente con profesionales. |
| **Prioridad** | Deseable |

| **RF-035** | **Acceso a la información de contacto de un fisioterapeuta** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios acceder a la información de contacto de un fisioterapeuta, como su número de teléfono, correo electrónico o dirección de la clínica, en caso de que esta información se haya incluido en su perfil. Esta información debe ser fácilmente accesible para facilitar la comunicación directa entre el paciente y el fisioterapeuta. |
| **Prioridad** | Crítica |

| **RF-036** | **Modificación de citas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y fisioterapeutas) modificar citas previamente agendadas. Esta funcionalidad debe incluir la posibilidad de cambiar la fecha, hora, tipo de consulta y otros detalles relevantes. El sistema debe notificar a ambas partes sobre cualquier modificación realizada en la cita. |
| **Prioridad** | Importante |

| **RF-038** | **Cancelación de citas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y fisioterapeutas) cancelar citas previamente agendadas. El sistema debe notificar a ambas partes sobre la cancelación y, en caso de que aplique, gestionar el reembolso del pago según las políticas de la plataforma. |
| **Prioridad** | Importante |

| **RF-039** | **Historial de citas** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los usuarios (pacientes y fisioterapeutas) acceder a un historial completo de sus citas pasadas, incluyendo detalles como la fecha, hora, tipo de consulta, profesional o paciente, y el estado de la cita (completada, cancelada, etc.). Este historial debe ser fácilmente accesible por el usuario. |
| **Prioridad** | Importante |

| **RF-040** | **Gestión de ejercicios y recursos** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe permitir a los fisioterapeutas crear y gestionar una biblioteca de ejercicios y recursos (videos, documentos, etc.) que puedan ser asignados a los pacientes como parte de su tratamiento. |
| **Prioridad** | Importante |

| **RF-041** | **Chat en tiempo real durante la videollamada** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Durante las videollamadas, la plataforma debe ofrecer un chat en tiempo real que permita la comunicación entre el fisioterapeuta y el paciente sin interrumpir la sesión. Este chat puede ser utilizado para compartir enlaces, documentos, o para resolver dudas rápidas. |
| **Prioridad** | Importante |

| **RF-042** | **Landing page para SEO** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe contar con una landing page optimizada para SEO que permita mejorar el posicionamiento en buscadores y atraer a nuevos usuarios. Esta página debe incluir información relevante sobre la plataforma y enlaces para el registro o inicio de sesión. |
| **Prioridad** | Importante |

---

<br>

## 3.2 Requisitos No Funcionales

| **RNF-001** | **Requisito de calidad** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La aplicación debe cumplir con al menos los requisitos críticos e importantes. |
| **Prioridad** | Crítica |

| **RNF-002** | **Plataforma web y aplicación móvil** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La solución debe contar con una plataforma web accesible desde navegadores, con soporte para iOS y Android. |
| **Prioridad** | Crítica |

| **RNF-003** | **Multilenguaje** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer soporte en varios idiomas, al menos en español e inglés. |
| **Prioridad** | Deseable |

| **RNF-004** | **Cumplimiento con normativa GDPR/LOPD** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe cumplir con las regulaciones de protección de datos como el GDPR en Europa o la LOPD en España. |
| **Prioridad** | Crítica |

| **RNF-005** | **Aceptación de términos y condiciones sobre responsabilidad** |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Durante el registro, el paciente debe aceptar los "Términos y Condiciones" de la plataforma, los cuales especificarán las responsabilidades del paciente, incluyendo la exoneración de responsabilidad del fisioterapeuta en caso de realizar los ejercicios de forma autónoma sin seguimiento directo. Este paso será obligatorio para la creación de la cuenta. |
| **Prioridad** | Importante |

| **RNF-006** | **Seguridad y protección de datos** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe garantizar la seguridad de los datos de los usuarios, mediante autenticación segura y encriptación de datos.|
| **Prioridad** | Importante |

| **RNF-007** | **Usabilidad** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ser fácil de usar tanto para fisioterapeutas como para pacientes, con una interfaz intuitiva. |
| **Prioridad** | Crítica |

| **RNF-008** | **Accesibilidad para personas con discapacidad** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ser accesible para personas con discapacidad, incluyendo el cumplimiento de los estándares de accesibilidad web (WCAG) y la garantía de que la interfaz sea compatible con lectores de pantalla, teclados alternativos y otras tecnologías de asistencia. |
| **Prioridad** | Deseable |

| **RNF-009** | **Soporte técnico** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ofrecer un servicio de soporte técnico para resolver dudas y problemas que puedan surgir durante el uso de la plataforma. El soporte puede ser ofrecido a través de diferentes canales (chat, correo electrónico, teléfono) y debe estar disponible en horarios convenientes para los usuarios. |
| **Prioridad** | Importante |

| **RNF-010** | **Marca y diseño** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe tener una imagen de marca coherente y un diseño atractivo y profesional. El diseño debe reflejar los valores de la marca y ser consistente en todos los elementos de la plataforma (logo, colores, tipografía, etc.). |
| **Prioridad** | Deseable |

| **RNF-010** | **Marca y diseño** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe tener una imagen de marca coherente y un diseño atractivo y profesional. El diseño debe reflejar los valores de la marca y ser consistente en todos los elementos de la plataforma (logo, colores, tipografía, etc.). |
| **Prioridad** | Deseable |

| **RNF-011** | **Integración con pasarelas de pago** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe integrarse con pasarelas de pago seguras y confiables para permitir a los pacientes realizar pagos online de forma segura y cómoda. Se deben ofrecer diferentes opciones de pago (tarjeta de crédito, PayPal, etc.) y garantizar que la información de pago esté protegida en todo momento. |
| **Prioridad** | Crítica |

| **RNF-012** | **Disponibilidad y rendimiento** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe estar disponible para los usuarios de forma continua, con un rendimiento óptimo que permita una navegación fluida y una respuesta rápida a las acciones del usuario. |
| **Prioridad** | Crítica |

| **RNF-013** | **Validación de perfiles de fisioterapeutas** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe incluir un proceso de validación para los perfiles de fisioterapeutas, que verifique la autenticidad de la información proporcionada, como el número de colegiado y las certificaciones. Este proceso puede incluir la revisión manual por parte de un administrador o la integración con bases de datos de colegios profesionales. |
| **Prioridad** | Crítica |

---

<br>

## 3.3 Requisitos de Información

| **RI-001** | **Historial clínico con plantillas personalizables** |
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder registrar el historial clínico del paciente mediante plantillas personalizables para diferentes tipos de tratamientos y patologías. |
| **Prioridad** | Importante |
