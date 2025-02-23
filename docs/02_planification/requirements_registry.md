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
    - [3.1.1 Rol en el sistema: Usuario invitado](#311-rol-en-el-sistema-usuario-invitado)
    - [3.1.1 Rol en el sistema: Paciente](#311-rol-en-el-sistema-paciente)
    - [3.1.1 Rol en el sistema: Fisioterapeuta](#311-rol-en-el-sistema-fisioterapeuta)
    - [3.1.1 Rol en el sistema: Administrador](#311-rol-en-el-sistema-administrador)
  - [3.2 Requisitos No Funcionales](#32-requisitos-no-funcionales)
  - [3.3 Requisitos de Información](#33-requisitos-de-información)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

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
| 23/02/2025 | v2.0    | Guadalupe Ridruejo Pineda, Julen Redondo Pacheco   | Modificación de los requisitos de acuerdo con la nueva versión de historias de usuario (fisioterapeutas y administradores)  |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los requisitos contemplados en el proyecto FisioFind.  

## 1.1. Recopilación de requisitos  
La recopilación de requisitos es un proceso esencial para identificar y definir de manera clara y precisa las expectativas de los usuarios y los objetivos estratégicos del proyecto. Este proceso permite asegurar que el sistema a desarrollar satisfaga completamente las demandas del negocio y de los usuarios finales.  
Para este proyecto, enfocado en la relación entre fisioterapeutas y sus clientes, la recopilación de requisitos se llevará a cabo a través de diversas técnicas, garantizando que cada aspecto relevante sea considerado.  

Métodos de Recopilación: 

- **Reunión entre integrantes del grupo**: los propios integrantes del grupo realizarán reuniones para definir aquellos requisitos relacionados con aspectos más técnicos de la aplicación.

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
### 3.1.1 Rol en el sistema: Usuario invitado

| **RF-XXX** | **Perfil profesional verificado**  |
| --- | --- |
| **Código HU** | HI-XXX |
| **Versión** | V1.0 |
| **Descripción** | x |
| **Prioridad** | x |

### 3.1.1 Rol en el sistema: Paciente

| **RF-XXX** | **Perfil profesional verificado**  |
| --- | --- |
| **Código HU** | HI-XXX |
| **Versión** | V1.0 |
| **Descripción** | x |
| **Prioridad** | x |

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

### 3.1.1 Rol en el sistema: Fisioterapeuta

| **RF-XXX** | **Registro de datos personales y profesionales**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta ingresar su nombre, apellidos, correo electrónico y contraseña en el formulario de registro. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Registro de datos profesionales**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta ingresar su número de colegiado y el nombre del colegio profesional al que pertenece. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Verificación automática de colegiación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe verificar automáticamente la validez del número de colegiado y la pertenencia a un colegio profesional registrado en la base de datos oficial. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Validación manual de colegiación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Si la verificación automática falla, el sistema debe permitir al fisioterapeuta subir documentación adicional para validar su perfil. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Manejo de errores en la validación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Si la verificación del número de colegiado no es exitosa, el sistema debe mostrar un mensaje de error claro con los pasos a seguir. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Selección de plan de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Una vez validada la colegiación, el sistema debe permitir al fisioterapeuta seleccionar uno de los dos planes de suscripción disponibles: Fisio Blue o Fisio Gold. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Protección de información bancaria para domicialición del pago**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | La información bancaria proporcionada por el fisioterapeuta para la domiciliación del cobro del tipo de suscripción mensual seleccionado solo será visible para el sistema. |
| **Prioridad** | Importante |

| **RF-XXX** | **Descripción de los planes de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe proporcionar una descripción clara de las características y beneficios de cada plan antes de que el fisioterapeuta tome una decisión. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Cambio de plan de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder cambiar de plan en el futuro después del registro inicial. |
| **Prioridad** | Importante |

| **RF-XXX** | **Cancelación del plan de suscripción**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder darse de baja de la plataforma en el momento que desee y no se realizará ningún cobro adicional a partir de su última mensualidad. |
| **Prioridad** | Importante |

| **RF-XXX** | **Prueba gratuita de la plataforma**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Si se considera necesario, el sistema debe ofrecer una opción de prueba con acceso limitado antes de seleccionar un plan definitivo. |
| **Prioridad** | Baja |

| **RF-XXX** | **Notificación de prueba gratuita**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Durante la prueba gratuita, el fisioterapeuta debe recibir notificaciones recordándole que su acceso es limitado y que debe elegir un plan definitivo. |
| **Prioridad** | Baja |

| **RF-XXX** | **Confirmación de registro**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Una vez finalizado el registro, el fisioterapeuta debe recibir un correo de confirmación con un enlace de activación para validar su cuenta. |
| **Prioridad** | Importante |

| **RF-XXX** | **Seguridad de la cuenta**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe garantizar la seguridad de los datos del fisioterapeuta mediante cifrado y almacenamiento seguro de la contraseña. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Recuperación de contraseña**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder recuperar su contraseña a través de un proceso de validación de correo electrónico. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Accesibilidad y compatibilidad**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | El formulario de registro debe ser accesible desde dispositivos móviles y de escritorio. |
| **Prioridad** | Importante |

| **RF-XXX** | **Notificación en la aplicación**  |
| --- | --- |
| **Código HU** | HF-001 |
| **Versión** | V1.0 |
| **Descripción** | Una vez registrado correctamente, el fisioterapeuta debe recibir una notificación dentro de la aplicación informándole que su perfil está listo para ser validado. |
| **Prioridad** | Importante |

| **RF-XXX** | **Edición de perfil**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá modificar su foto de perfil, especialidad, descripción, y otros datos desde su panel de configuración. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Validación de campos obligatorios**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar que los campos obligatorios como la información del título y el código postal sean ingresados correctamente. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Configuración de precios y servicios**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá establecer y modificar los precios de consulta, incluyendo la opción de ofrecer la primera consulta gratis, así como definir distintos tipos de servicios y bonos. |
| **Prioridad** | Importante |

| **RF-XXX** | **Gestión de disponibilidad horaria**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá modificar su disponibilidad horaria y tendrá la opción de desactivar temporalmente su disponibilidad sin eliminar los datos. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Protección de información bancaria**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | La información bancaria solo será visible para el sistema y se utilizará exclusivamente para recibir pagos de consultas. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Seguridad de datos sensibles**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se aplicarán medidas de seguridad para proteger la información personal y bancaria del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Vista previa del perfil**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá una vista previa del perfil antes de publicar los cambios para verificar cómo lo ven los pacientes. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Actualización en tiempo real**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes verán el perfil actualizado en tiempo real tras la edición del fisioterapeuta. |
| **Prioridad** | Importante |

| **RF-XXX** | **Actualización en tiempo real**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes verán el perfil actualizado en tiempo real tras la edición del fisioterapeuta. |
| **Prioridad** | Importante |

| **RF-XXX** | **Archivos personalizados**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema deberá permitir a los fisioterapeutas crear y modificar cuestionarios, tests y herramientas de las proporcionadas por la plataforma. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Archivos personalizados**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema deberá permitir a los fisioterapeutas crear y modificar cuestionarios, tests y herramientas de las proporcionadas por la plataforma. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Compartir archivos**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá a los fisioterapeutas subir archivos en su perfil en formatos compatibles y que sean visibles para aquellos pacientes a los que se permita el acceso de forma explícita. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Validación de archivos**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar el tipo y tamaño de los archivos permitidos para garantizar compatibilidad y seguridad. |
| **Prioridad** | Importante |

| **RF-XXX** | **Notificación de cambios guardados**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta recibirá una confirmación cuando los cambios en su perfil se hayan guardado correctamente. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Alerta de información faltante o incorrecta**  |
| --- | --- |
| **Código HU** | HF-002 |
| **Versión** | V1.0 |
| **Descripción** | Se enviará una alerta en caso de que haya información faltante o incorrecta en el perfil del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Visualización del calendario**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá ver su agenda en una vista semanal y mensual, con diferenciación entre citas confirmadas y pendientes. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Actualización en tiempo real**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | El calendario se actualizará en tiempo real con los cambios realizados en la agenda del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Gestión de disponibilidad**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá modificar la disponibilidad horaria directamente desde el calendario y establecer pausas o días bloqueados. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Notificación a pacientes afectados**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Se notificará a los pacientes afectados en caso de cambios en la disponibilidad del fisioterapeuta, ya sea porque el fisioterapeuta modifica su disponibilidad o se da de baja de la plataforma. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Interacción con citas**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá ver los detalles de cada cita y tendrá la opción de reprogramarlas o cancelarlas bajo ciertas condiciones. |
| **Prioridad** | Importante |

| **RF-XXX** | **Usabilidad y experiencia del usuario**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | La interfaz del calendario deberá ser intuitiva y contar con filtros para visualizar diferentes tipos de citas y disponibilidad. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Seguridad y control de acceso**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Solo el fisioterapeuta tendrá acceso para modificar su disponibilidad y se registrarán los cambios realizados en la agenda. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Confirmación de cambios en la agenda**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Los cambios en la agenda deberán confirmarse antes de aplicarse para evitar modificaciones accidentales. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Notificaciones y recordatorios**  |
| --- | --- |
| **Código HU** | HF-003 |
| **Versión** | V1.0 |
| **Descripción** | Se enviarán recordatorios automáticos al fisioterapeuta sobre citas próximas y cambios en la agenda. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Consulta del estado de la cita**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá consultar el estado actual de una cita (pendiente, aceptada, rechazada o modificada) desde su panel de control. |
| **Prioridad** | Importante |

| **RF-XXX** | **Aceptación de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá aceptar una cita desde la plataforma, lo que enviará una notificación automática al paciente. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Rechazo de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá rechazar una cita, con opción de añadir un motivo, notificando automáticamente al paciente. |
| **Prioridad** | Importante |

| **RF-XXX** | **Modificación de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá solicitar una modificación de la fecha y hora de una cita, notificando al paciente, quien deberá aceptar o rechazar la propuesta. |
| **Prioridad** | Importante |

| **RF-XXX** | **Notificación de citas pendientes**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | Se enviarán notificaciones al fisioterapeuta sobre citas pendientes de aceptar, rechazar o modificar *dentro de un plazo determinado (están por determinar las distintas casuísticas)*. |
| **Prioridad** | Importante |

| **RF-XXX** | **Historial de citas modificadas o rechazadas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá consultar un historial de citas rechazadas o modificadas, incluyendo la fecha original y el motivo de la modificación o rechazo. |
| **Prioridad** | Baja |

| **RF-XXX** | **Confirmación de cambios**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | Tras aceptar, rechazar o modificar una cita, el fisioterapeuta recibirá una notificación confirmando que la acción ha sido registrada correctamente. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Accesibilidad y usabilidad**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | La funcionalidad de gestión de citas debe ser fácilmente accesible en la interfaz, permitiendo su uso desde dispositivos móviles y de escritorio. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Seguridad en la gestión de citas**  |
| --- | --- |
| **Código HU** | HF-004 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que las notificaciones y cambios en las citas estén protegidos, evitando accesos no autorizados. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Sistema de valoración**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes podrán valorar la consulta realizada con un sistema de estrellas (1 a 5) y dejar comentarios adicionales en el perfil del fisioterapeuta. |
| **Prioridad** | Importante |

| **RF-XXX** | **Publicación y moderación**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Solo los pacientes con una consulta confirmada podrán dejar valoraciones. Los fisioterapeutas no podrán eliminarlas, pero podrán responder a los comentarios. |
| **Prioridad** | Importante |

| **RF-XXX** | **Visualización de valoraciones**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Las valoraciones estarán organizadas cronológicamente en el perfil del fisioterapeuta, mostrando el promedio de estrellas y permitiendo filtrarlas por puntuación. |
| **Prioridad** | Importante |

| **RF-XXX** | **Notificaciones y alertas**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta recibirá una notificación cuando un paciente deje una valoración. Se enviará una solicitud de valoración automática al paciente después de la consulta. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Protección contra abuso**  |
| --- | --- |
| **Código HU** | HF-005 |
| **Versión** | V1.0 |
| **Descripción** | Un paciente solo podrá valorar una consulta realizada. Se permitirá reportar comentarios ofensivos o falsos para su revisión. |
| **Prioridad** | Baja |

| **RF-XXX** | **Acceso a biblioteca de cuestionarios y tests**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá acceder a una biblioteca de cuestionarios y tests prediseñados para su uso. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Modificación de cuestionarios existentes**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá modificar textos, preguntas y herramientas de valoración de los cuestionarios prediseñados. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Creación de cuestionarios personalizados**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá crear nuevos cuestionarios desde cero y guardarlos como plantillas reutilizables. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Tipos de preguntas personalizables**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se podrán agregar preguntas abiertas, cerradas, de opción múltiple y escalas de valoración. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Configuración de preguntas**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá configurar preguntas como obligatorias u opcionales dentro de los cuestionarios. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Organización y almacenamiento de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas podrán organizar sus cuestionarios en categorías personalizadas y almacenarlos de manera segura. |
| **Prioridad** | Importante |

| **RF-XXX** | **Compartir cuestionarios con otros fisioterapeutas**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá compartir cuestionarios entre fisioterapeutas dentro de la plataforma (si la opción está habilitada). |
| **Prioridad** | Baja |

| **RF-XXX** | **Asignación de cuestionarios a consultas**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá asignar cuestionarios específicos a pacientes antes o después de una consulta. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Acceso a respuestas de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se permitirá acceder rápidamente a las respuestas de los pacientes desde su historial de tratamientos. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Notificaciones automáticas a pacientes**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se enviarán notificaciones automáticas a los pacientes para completar cuestionarios antes de la sesión. |
| **Prioridad** | Importante |

| **RF-XXX** | **Configuración de visibilidad de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá configurar cuestionarios como privados o públicos según su preferencia. |
| **Prioridad** | Baja |

| **RF-XXX** | **Vista previa de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se incluirá una opción para previsualizar los cuestionarios antes de enviarlos a los pacientes. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Interfaz intuitiva para pacientes**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes podrán completar cuestionarios fácilmente desde cualquier dispositivo. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Confirmación de recepción de cuestionarios**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Se enviará una confirmación al fisioterapeuta cuando un paciente haya enviado su cuestionario completado. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Exportación y descarga de cuestionarios y tests**  |
| --- | --- |
| **Código HU** | HF-006 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas podrán descargar los cuestionarios en formato PDF o visualizarlos en línea. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Obligación de completar el cuestionario preintervención**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe completar el cuestionario preintervención antes de poder confirmar su cita. No se podrá avanzar en el proceso de reserva hasta que el cuestionario esté completamente rellenado, si así lo ha determinado el fisioterapeuta. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Personalización según especialidad del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir la creación y edición de cuestionarios preintervención personalizados, de acuerdo con la especialidad del fisioterapeuta. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Preguntas generales y específicas**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El cuestionario debe contener una versión plantilla con preguntas generales sobre el estado de salud del paciente y preguntas específicas según la especialidad del fisioterapeuta, como historial médico, lesiones previas, hábitos de vida, tipo de dolor, etc. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Revisión y corrección de respuestas**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder revisar y corregir sus respuestas antes de confirmar la información del cuestionario. |
| **Prioridad** | Importante |

| **RF-XXX** | **Visualización de resultados por el fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a los resultados del cuestionario en su panel de control para realizar un diagnóstico preliminar antes de confirmar la cita. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Cumplimiento con regulaciones de privacidad de datos**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | Toda la información contenida en el cuestionario debe ser tratada con seguridad, cumpliendo con regulaciones de privacidad de datos como el RGPD. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Accesibilidad desde dispositivos móviles y de escritorio**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El cuestionario debe ser accesible tanto desde dispositivos móviles como de escritorio, adaptándose a diferentes tamaños de pantalla. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Validación de respuestas del cuestionario**  |
| --- | --- |
| **Código HU** | HF-007 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe validar que todos los campos obligatorios estén completos y que no haya respuestas incorrectas o fuera de lugar antes de permitir que el paciente envíe el cuestionario. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Obligación de pago antes de confirmar la cita**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes deberán abonar el importe completo de la consulta en una ventada de 48 horas antes de la consulta. El pago debe realizarse a través de la plataforma con tarjeta bancaria o un método de pago habilitado. |
| **Prioridad** | Importante |

| **RF-XXX** | **Política de cancelación y reembolso**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | El paciente podrá cancelar hasta 48 horas antes de la cita y no se efectuará ningún pago. Después de las 48 horas, no habrá reembolso. El sistema debe notificar al paciente sobre esta política al momento de *introducir sus datos para realizar el cobro (tengo dudas sobre si el paciente debe introducir sus datos bancarios al solicitar la consulta o si 48h antes de la misma para confirmar la consulta el paciente debe abonar el importe y en caso contrario automáticamente se cancela)*. |
| **Prioridad** | Importante |

| **RF-XXX** | **Integración con la agenda del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | Una vez realizado el pago, la cita debe reflejarse como confirmada en la agenda del fisioterapeuta. El fisioterapeuta podrá ver si el pago está confirmado o pendiente. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Notificación al paciente sobre pago y cancelación**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | El paciente recibirá una notificación confirmando el pago exitoso y la cita agendada. También recibirá una notificación en caso de reembolso tras la cancelación por parte del fisioterapeuta (si aplica). |
| **Prioridad** | Importante |

| **RF-XXX** | **Seguridad en el proceso de pago**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe garantizar que todos los pagos se procesen de manera segura, cumpliendo con las normativas de seguridad bancaria, como PCI-DSS. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Procesamiento automático de reembolsos**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | En caso de cancelación dentro de las 48 horas, el sistema procesará automáticamente el reembolso del pago al mismo método utilizado para la transacción. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Historial de pagos accesible para paciente y fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-008 |
| **Versión** | V1.0 |
| **Descripción** | Tanto el paciente como el fisioterapeuta tendrán acceso al historial de pagos, permitiendo verificar los pagos realizados y confirmar si el paciente ha pagado. |
| **Prioridad** | Importante |

| **RF-XXX** | **Generación automática de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema generará automáticamente una factura por cada consulta realizada. La factura incluirá detalles como: nombre del paciente, especialidad del fisioterapeuta, motivo de la consulta, fecha de la cita, importe, impuestos aplicables y forma de pago. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Almacenamiento seguro de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | Las facturas generadas se almacenarán de manera segura en la base de datos del sistema, accesibles solo por el fisioterapeuta correspondiente. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Almacenamiento seguro de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | Las facturas generadas se almacenarán de manera segura en la base de datos del sistema, accesibles solo por el fisioterapeuta correspondiente. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Consulta de facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá consultar y ver todas las facturas generadas, ordenadas por fecha de emisión. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Descarga de facturas en formato PDF**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá al fisioterapeuta descargar las facturas generadas en formato PDF. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Envío de facturas por correo electrónico**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema enviará una copia de la factura al correo electrónico del fisioterapeuta una vez que se haya generado. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Notificación de facturación**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema notificará al fisioterapeuta cuando una factura haya sido generada y esté disponible para su consulta y descarga. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Seguridad y privacidad de las facturas**  |
| --- | --- |
| **Código HU** | HF-009 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que las facturas sean accesibles solo para el fisioterapeuta correspondiente. Además, la información de las facturas estará protegida mediante medidas de seguridad adecuadas, como el cifrado de datos y el acceso autenticado. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Iniciar videollamada desde la agenda de citas**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder iniciar la videollamada directamente desde su agenda de citas, mediante un botón o enlace visible en la cita programada. El sistema debe proporcionar una interfaz sencilla para acceder a la videollamada. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Temporizador visible durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe mostrar un temporizador visible que indique el tiempo restante de la consulta. Este temporizador debe iniciar automáticamente cuando la videollamada comience y detenerse al finalizar. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Restricciones de tiempo para finalizar la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | *El sistema no permitirá al fisioterapeuta finalizar la videollamada hasta que haya transcurrido al menos el 75% del tiempo asignado a la consulta. El fisioterapeuta debe ser notificado cuando el 75% del tiempo haya pasado (esot está pensado porque como el paciente abona el precio de la consulta previo a la misma, para que no reciba un servicio menor de por lo que ha pagado).* |
| **Prioridad** | Deseable |

| **RF-XXX** | **Calidad de la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | La videollamada debe tener alta calidad con opciones para ajustar micrófono, video y compartir pantalla si es necesario. El sistema debe garantizar que no haya interrupciones significativas en la calidad de la videollamada (latencia, cortes, etc.). |
| **Prioridad** | Baja |

| **RF-XXX** | **Notificación de finalización de la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | Al finalizar la videollamada, el sistema notificará al fisioterapeuta y al paciente que la consulta ha terminado. Además, se guardará un registro de la videollamada en el historial de citas del paciente y fisioterapeuta. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Compatibilidad y accesibilidad**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | La videollamada debe ser compatible con dispositivos móviles y de escritorio. Debe ser accesible desde cualquier navegador común sin necesidad de instalar software adicional. |
| **Prioridad** | Importante |

| **RF-XXX** | **Seguridad de la videollamada**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | La videollamada debe estar protegida con cifrado de extremo a extremo para garantizar la privacidad de la consulta. Solo el fisioterapeuta y el paciente deben tener acceso a la videollamada. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Resolución de problemas comunes**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe incluir opciones para solucionar problemas comunes durante las videollamadas, como problemas de conexión o de audio/video. En caso de interrupciones, el sistema debe permitir reanudar la llamada o reprogramar la cita. |
| **Prioridad** | Baja |

| **RF-XXX** | **Resolución de problemas comunes**  |
| --- | --- |
| **Código HU** | HF-010 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe incluir opciones para solucionar problemas comunes durante las videollamadas, como problemas de conexión o de audio/video. En caso de interrupciones, el sistema debe permitir reanudar la llamada o reprogramar la cita. |
| **Prioridad** | Baja |

| **RF-XXX** | **Acceso al historial clínico del paciente durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | Durante la videollamada, el fisioterapeuta podrá acceder al historial clínico del paciente almacenado en el sistema, con la opción de modificar la información que sea necesaria. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Compartir pantalla durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá compartir su pantalla con el paciente durante la videollamada para mostrar diapositivas, documentos o cualquier otra información relevante. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Acceso al modelo anatómico 3D**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá al fisioterapeuta acceder y utilizar un modelo anatómico 3D para ilustrar al paciente sobre su patología y tratamiento durante la videollamada. |
| **Prioridad** | Importante |

| **RF-XXX** | **Acceso a plantillas de test y cuestionarios**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá acceder a plantillas de tests y cuestionarios predefinidos que se podrán personalizar y utilizar durante la videollamada. |
| **Prioridad** | Importante |

| **RF-XXX** | **Personalización de cuestionarios y tests**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá crear y personalizar cuestionarios, tests y pautas de ejercicio (como Google Forms), los cuales podrán incluir elementos como mapas de dolor, escalas de evaluación, entre otros. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Almacenamiento de información recogida durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-011 |
| **Versión** | V1.0 |
| **Descripción** | Toda la información recogida mediante cuestionarios, tests, o notas del fisioterapeuta durante la videollamada debe ser almacenada en el sistema para su posterior consulta y análisis. |
| **Prioridad** | Importante |

| **RF-XXX** | **Subida y gestión de archivos de vídeo**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá subir archivos de vídeo a su espacio personal en la plataforma, y el sistema debe permitir la modificación de los vídeos ya subidos con opciones para editar, borrar o reemplazar los archivos existentes. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Acceso a los vídeos por parte de los pacientes**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta podrá configurar permisos para que solo los pacientes correspondientes puedan acceder a los vídeos. Los pacientes con acceso podrán visualizar los vídeos desde su perfil en la plataforma. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Vinculación de vídeos explicativos a ejercicios**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El sistema permitirá asociar vídeos explicativos a ejercicios específicos dentro de una planificación de ejercicios. Los pacientes podrán acceder directamente al vídeo desde el ejercicio asignado. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Acceso desde cualquier dispositivo**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | Los pacientes podrán acceder a los vídeos subidos desde cualquier dispositivo (móvil o escritorio) de forma sencilla y sin problemas de compatibilidad. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Seguridad y privacidad de los vídeos**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | Los vídeos deben estar protegidos por medidas de seguridad adecuadas, como permisos de acceso y cifrado, para garantizar que solo los pacientes autorizados puedan visualizarlos. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Control de acceso de los vídeos**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que solo el fisioterapeuta que subió el vídeo y los pacientes autorizados tengan acceso a los archivos de vídeo. |
| **Prioridad** | Crítico |

| **RF-XXX** | **Calidad y optimización de los vídeos**  |
| --- | --- |
| **Código HU** | HF-012 |
| **Versión** | V1.0 |
| **Descripción** | El sistema garantizará que los vídeos subidos mantengan una calidad adecuada para su visualización en diferentes dispositivos. Además, los archivos de vídeo deben optimizarse para evitar tiempos de carga excesivos o problemas de reproducción. |
| **Prioridad** | Baja |

| **RF-XXX** | **Acceso y gestión de plantillas predefinidas**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder acceder a plantillas predefinidas para test de valoración, cuestionarios y prescripción de ejercicios dentro de la plataforma. Las plantillas deben ser fácilmente editables para permitir personalización según las necesidades del fisioterapeuta. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Creación de test y cuestionarios personalizados**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta crear test y cuestionarios personalizados desde cero, permitiendo definir preguntas y respuestas, tipos de respuestas (por ejemplo, opción múltiple, texto libre, escala de valoración) y establecer criterios de evaluación. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Generación de prescripción de ejercicios**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir al fisioterapeuta generar plantillas de prescripción de ejercicios con campos como: nombre del paciente, diagnóstico, frecuencia de los ejercicios, tiempo estimado de la sesión, hora recomendada para realizar los ejercicios (opcional), detalles del ejercicio (nombre, objetivo, descripción, material necesario, series, repeticiones, carga, método de evaluación). El fisioterapeuta debe poder incluir enlaces a vídeos subidos por él para ilustrar los ejercicios. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Cuestionarios interactivos para pacientes**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe poder completar los cuestionarios directamente en la plataforma. Los resultados de los cuestionarios deben ser enviados automáticamente al fisioterapeuta para su revisión. Idealmente, estos podrían ser visualizados como *dashborads* |
| **Prioridad** | Crítica |

| **RF-XXX** | **Almacenamiento en el espacio personal del fisioterapeuta**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | Todos los test, cuestionarios y prescripciones de ejercicios deben almacenarse en el espacio personal del fisioterapeuta dentro de la plataforma. El fisioterapeuta debe poder consultar y acceder a los cuestionarios y ejercicios en cualquier momento. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Notificaciones y recordatorios para pacientes**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe permitir que se envíen notificaciones y recordatorios automáticos al paciente sobre la hora recomendada para realizar los ejercicios. El paciente debe tener la opción de ajustar las notificaciones de recordatorio en su sección de tratamiento/seguimiento. |
| **Prioridad** | Importante |

| **RF-XXX** | **Seguridad y privacidad de datos**  |
| --- | --- |
| **Código HU** | HF-013 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe garantizar que toda la información personal y los resultados de los cuestionarios estén protegidos por medidas de seguridad adecuadas. Solo el fisioterapeuta que ha creado los test y cuestionarios debe tener acceso completo a ellos, y los pacientes deben tener acceso solo a los cuestionarios que se les han asignado. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Acceso a la lista de pacientes activos**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a una lista de todos los pacientes que están bajo su seguimiento activo. La lista debe estar ordenada por fecha de inicio del tratamiento o por cualquier otra métrica relevante para el fisioterapeuta (por ejemplo, nombre del paciente). |
| **Prioridad** | Crítica |

| **RF-XXX** | **Visibilidad del progreso de cada paciente**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder ver un resumen de cada paciente, que incluya detalles clave sobre el tratamiento, como el tipo de tratamiento asignado, las fechas de consulta y el progreso general. Los datos de progreso deben incluir informes de ejercicios realizados, evolución del dolor o movilidad, y otros indicadores de tratamiento relevantes (*estos vendrán determinados por los ejercicios pautados*). |
| **Prioridad** | Crítica |

| **RF-XXX** | **Acceso a informes de progreso**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder generar y consultar informes detallados del progreso de cada paciente, basados en las evaluaciones previas y en el seguimiento realizado. Los informes deben ser accesibles desde el perfil de cada paciente, y deben incluir gráficos o tablas de evolución. |
| **Prioridad** | Importante |

| **RF-XXX** | **Registro de interacciones**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe registrar y mostrar las interacciones pasadas entre el fisioterapeuta y el paciente, incluyendo consultas, notas de evaluación, ajustes en el tratamiento y cualquier comunicación relevante. El fisioterapeuta debe poder agregar notas adicionales sobre cada paciente. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Acciones en función del progreso**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | Si un paciente no está siguiendo el tratamiento correctamente, el fisioterapeuta debe poder tomar acciones como enviar recordatorios, modificar el tratamiento o contactar al paciente para discutir el progreso. El sistema debe permitir configurar alertas o notificaciones para los fisioterapeutas si un paciente muestra signos de no seguir el tratamiento. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Visualización del cumplimiento del tratamiento**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a un registro claro de cuántos ejercicios han sido completados por el paciente y qué porcentaje del tratamiento se ha seguido correctamente. Esta visualización debe estar disponible en tiempo real para que el fisioterapeuta pueda ajustar el tratamiento según sea necesario. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Historial completo de tratamiento**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder ver el historial completo de tratamiento de cada paciente, con detalles sobre todas las citas anteriores, diagnósticos, tratamientos realizados, y resultados obtenidos. |
| **Prioridad** | Importante |

| **RF-XXX** | **Comunicación con el paciente**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener una opción para comunicarse directamente con el paciente dentro de la plataforma, ya sea por mensaje o video, si es necesario para discutir el progreso o hacer ajustes en el tratamiento.|
| **Prioridad** | Deseable |

| **RF-XXX** | **Filtrado y búsqueda de pacientes**  |
| --- | --- |
| **Código HU** | HF-014 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder filtrar o buscar pacientes según diferentes criterios (por ejemplo, fecha de inicio del tratamiento, tipo de tratamiento, progreso) para facilitar la gestión de su carga de trabajo.|
| **Prioridad** | Importante |

| **RF-XXX** | **Notificaciones de consultas**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El sistema debe enviar recordatorios automáticos a los pacientes sobre la fecha y hora de la consulta agendada, con suficiente antelación.|
| **Prioridad** | Importante |

| **RF-XXX** | **Cancelación de consultas**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe tener la opción de cancelar la consulta a través de la plataforma, y el fisioterapeuta debe recibir una notificación cuando esto ocurra.|
| **Prioridad** | Crítica |

| **RF-XXX** | **Configuración de recordatorios**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder configurar los recordatorios según sus preferencias, ajustando la antelación y frecuencia de los mismos.|
| **Prioridad** | Deseable |

| **RF-XXX** | **Visualización de recordatorios**  |
| --- | --- |
| **Código HU** | HF-015 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder ver los recordatorios programados para cada paciente en su agenda, con la posibilidad de editar o anular los recordatorios si es necesario.|
| **Prioridad** | Deseable |

| **RF-XXX** | **Frecuencia y notificación de recordatorios**  |
| --- | --- |
| **Código HU** | HF-016 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe seleccionar la frecuencia y hora específica para enviar los recordatorios, que deben llegar al paciente por aplicación o correo electrónico. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Confirmación de ejercicio realizado**  |
| --- | --- |
| **Código HU** | HF-016 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe marcar los ejercicios como realizados, y el fisioterapeuta debe poder ver un resumen de ejercicios completados y no completados. |
| **Prioridad** | Importante |

| **RF-XXX** | **Seguimiento y modificación de recordatorios**  |
| --- | --- |
| **Código HU** | HF-016 |
| **Versión** | V1.0 |
| **Descripción** | El paciente debe marcar los ejercicios como realizados, y el fisioterapeuta debe poder ver un resumen de ejercicios completados y no completados. |
| **Prioridad** | Importante |

| **RF-XXX** | **Recepción y carga de archivos**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe poder recibir y cargar archivos de los pacientes, principalmente imágenes de diagnóstico, directamente en el perfil del paciente. |
| **Prioridad** | Importante |

| **RF-XXX** | **Tipos de archivo soportados y notificaciones**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe admitir formatos comunes como JPG, PNG, PDF, DICOM y notificar a los pacientes cuando su archivo haya sido recibido correctamente. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Acceso y organización de archivos**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | Los fisioterapeutas deben poder acceder a los archivos cargados, organizados por fecha o tipo (ej. radiografía, ecografía), desde el perfil del paciente. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Almacenamiento seguro y acceso restringido**  |
| --- | --- |
| **Código HU** | HF-017 |
| **Versión** | V1.0 |
| **Descripción** | Los archivos deben almacenarse de forma segura con cifrado y cumplimiento normativo (ej. GDPR) y ser accesibles solo para el fisioterapeuta asignado. |
| **Prioridad** | Importante |

| **RF-XXX** | **Acceso al chat durante la videollamada**  |
| --- | --- |
| **Código HU** | HF-019 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe tener acceso a un chat en tiempo real durante la videollamada, sin interferir con la visualización de la sesión. |
| **Prioridad** | Importante |

| **RF-XXX** | **Funcionalidad de chat y envío de archivos adjuntos**  |
| --- | --- |
| **Código HU** | HF-019 |
| **Versión** | V1.0 |
| **Descripción** | El chat debe permitir enviar y recibir mensajes de texto sin retrasos, así como archivos adjuntos (documentos, imágenes, enlaces) que deben ser visibles para ambas partes. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Notificación de nuevos mensajes y facilidad de uso**  |
| --- | --- |
| **Código HU** | HF-019 |
| **Versión** | V1.0 |
| **Descripción** | El fisioterapeuta debe recibir notificaciones visuales de nuevos mensajes y el diseño del chat debe ser fácil de usar en diferentes dispositivos. |
| **Prioridad** | Baja |

### 3.1.1 Rol en el sistema: Administrador

| **RF-XXX** | **Gestión de usuarios**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder visualizar y administrar los perfiles de pacientes y fisioterapeutas, así como activar, suspender o eliminar cuentas. También debe gestionar las solicitudes de verificación de fisioterapeutas. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Gestión de citas**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder monitorear citas programadas, canceladas y completadas, y intervenir en disputas entre pacientes y fisioterapeutas si es necesario. |
| **Prioridad** | Deseable |

| **RF-XXX** | **Gestión de pagos y suscripciones**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe supervisar pagos, administrar planes de suscripción (Fisio Blue y Fisio Gold), y gestionar solicitudes de reembolsos o problemas de facturación. |
| **Prioridad** | Importante |

| **RF-XXX** | **Configuración general del sistema**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder modificar términos y condiciones, configurar parámetros generales de la plataforma (horarios, políticas, etc.) y gestionar bases de datos para validar fisioterapeutas. |
| **Prioridad** | Crítica |

| **RF-XXX** | **Generación de reportes y análisis**  |
| --- | --- |
| **Código HU** | HA-001 |
| **Versión** | V1.0 |
| **Descripción** | El administrador debe poder generar reportes sobre la actividad de la plataforma y analizar métricas para mejorar la experiencia de los usuarios. |
| **Prioridad** | Deseable |

---

<br>

## 3.2 Requisitos No Funcionales

| **RNF-001** | **Requisito de calidad** |
| --- | --- |
| **HU** | V1.0 |
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
| **Código HU** | HF-018 |
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
| **Descripción** | Durante el registro, el paciente debe aceptar los "Términos y Condiciones" de la plataforma, los cuales especificarán las responsabilidades del paciente, incluyendo la exoneración de responsabilidad del fisioterapeuta en caso de realizar los ejercicios de forma autónoma sin seguimiento directo, entre otros. Este paso será obligatorio para la creación de la cuenta. |
| **Prioridad** | Importante |

| **RNF-006** | **Seguridad y protección de datos** |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe garantizar la seguridad de los datos de los usuarios, mediante autenticación segura y encriptación de datos.|
| **Prioridad** | Importante |

| **RNF-007** | **Usabilidad** |  
| --- | --- |
| **Código HU** | HF-018 |
| **Versión** | V1.0 |
| **Descripción** | La plataforma debe ser fácil de usar tanto para fisioterapeutas como para pacientes, con una interfaz intuitiva. |
| **Prioridad** | Crítica |

| **RNF-008** | **Accesibilidad para personas con discapacidad** |  
| --- | --- |
| **Código HU** | HF-018 |
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

---

<br>

## 3.3 Requisitos de Información
