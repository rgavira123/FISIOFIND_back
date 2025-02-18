---
title: "USER STORIES"
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateo Villalba, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]         # CHANGE IF NEEDED
date: "13/02/2025"
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
header-left: "USER STORIES"                 
header-right: "13/02/2025"                                         
footer-left: "FISIOFIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIOFIND  -  USER STORIES
</p>
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateo Villalba, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Daniel Ruiz López, Daniel Fernandez Caballero, Daniel Alors Romero, Alberto Carmona Sicre, Delfín Santana Rubio

- **Fecha de Creación:** 13/02/2025  

- **Versión:** v1.1

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 13/02/2025 | v1.0    | Daniel Ruiz López, Alberto Carmona Sicre, Daniel Fernández Caballero, Daniel Alors Romero | Añadidas las historias de usuario. |
| 18/02/2025 | v1.1    | Delfín Santana Rubio  |  Actualizadas las historias de usuario |

<br>

<!-- \newpage -->

<br>


# 1. ESTRUCTURA DE LAS HISTORIAS DE USUARIO  

Las historias de usuario en este proyecto siguen una estructura estandarizada para garantizar claridad, consistencia y comprensión de los requisitos funcionales.  

Cada historia de usuario se redacta utilizando el siguiente formato:  

## Formato General  
> **Como** [tipo de usuario],  
> **Quiero** [acción o funcionalidad deseada],  
> **Para** [beneficio o valor esperado].  
<br>  

## Elementos Claves de una Historia de Usuario  

Cada historia de usuario debe cumplir con los siguientes elementos esenciales:  

1. **Usuario**: Define quién utilizará la funcionalidad.  
2. **Funcionalidad**: Describe qué acción se desea realizar.  
3. **Objetivo / Beneficio**: Explica la razón por la cual se requiere la funcionalidad. 

Esta estructura permite definir claramente los requerimientos y facilita la planificación y ejecución del desarrollo.  

## Leyenda sobre el índice de historias de usuario
Se explica el índice de las historias de usuario:
- HI-00x: Historia de usuario para rol invitado.
- HF-00x: Historia de usuario para rol fisioterapeutas
- HP-00x: Historia de usuario para rol paciente
- HA-00x: Historia de usuario para rol admin

# 2. HISTORIAS DE USUARIO


## HI-001: Acceso como paciente invitado
> **Como** usuario invitado,
> **Quiero** poder acceder a la plataforma de Fisio Find y realizar búsquedas de fisioterapeutas que se adapten a mis necesidades sin necesidad de estar registrado,  
> **Para** explorar opciones de profesionales y disponibilidad horaria antes de crear una cuenta.

**Comentarios**: El usuario invitado tendrá la posibilidad de ver la disponibilidad de los fisioterapeutas, pero una vez quiera reservar se le redirigirá al registro en la plataforma. 

**Criterios de aceptación**: TODO

---

## HI-002: Acceso como fisioterapeuta invitado  
> **Como** usuario invitado,
> **Quiero** poder acceder a la información de los servicios que ofrece la plataforma de Fisio Find,  
> **Para** valorar si me interesa registrarme como fisioterapeuta y ofrecer mis consultas a los pacientes.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HI-003: Valoración de otros fisioterapeutas
> **Como** usuario invitado,
> **Quiero** poder conocer la opinión de otros fisioterapeutas registrados en la plataforma,
> **Para** saber si los servicios que ofrece Fisio Find merecen la pena.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HP-001: Búsqueda avanzada
> **Como** usuario,
> **Quiero** poder buscar al mejor fisioterapeuta basándome en:
> - Palabras clave introducidas en la búsqueda
> - Especialidad
> - Código postal (información del perfil)
> - Valoraciones del fisioterapeuta
> - Precio 
> 
> **Para** encontrar un fisioterapeuta que se ajuste a mis necesidades.

**Comentarios**: La barra de búsqueda debe poder asociar el motivo de consulta que indicaría un paciente en una llamada telefónica o presencial (p.e: dolor lumbar, dolor de cuello, traumatismo, hernia, fascitis plantar, etc.) con los fisioterapeutas especialistas en esas patologías, para ello, será necesario tener registrada una asociación especialización-patología. 

**Criterios de aceptación**: TODO

---

## HP-002: Registro en Fisio Find
> **Como** usuario invitado,
> **Quiero** poder registrarme en la plataforma,
> **Para** facilitar mis datos a los fisioterapeutas al reservar una cita y acceder a todas las funcionalidades de Fisio Find.

**Comentarios**: De aquí queremos sacar la restricción de que si, sin estar registrado, quieres seleccionar una cita o hacer cualquier acción que no sea buscar fisios, tienes que estar registrado. 

**Criterios de aceptación**: TODO

---

## HP-003: Reserva de citas como usuario registrado 
> **Como** usuario registrado,
> **Quiero** una vez he seleccionado el fisioterapeuta idóneo para mi patología, quiero poder escoger mediante un calendario la fecha y hora que más me convenga para la cita,
> **Para** gestionar mi disponibilidad de manera eficiente.

**Comentarios**: Una vez que hemos reservado la cita podemos referirnos al usuario registrado como paciente, de aquí sacamos el requisito de información del usuario registrado.

**Criterios de aceptación**: TODO

---

## HP-004: Pago de citas por la aplicación  
> **Como** paciente,
> **Quiero** abonar el coste de la cita en la propia plataforma con tarjeta bancaria,
> **Para** completar el pago de manera segura y cómoda sin necesidad de realizar transferencias externas.

**Comentarios**: El pago se realizará una vez se encuentre dentro de la franja horaria de 48 horas previas a la cita. Esto sirve por si cancelo antes de las 48 horas para que no sea necesario pagar y evitar el cargo en la tarjeta. 

**Criterios de aceptación**: TODO

---

## HP-005: Mis citas 
> **Como** paciente,
> **Quiero** poder consultar mis futuras citas en un apartado de mi perfil y/o en un calendario interactivo con recordatorios dentro de la aplicación,
> **Para** gestionar mis consultas de manera organizada y evitar olvidos.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HP-006: Mi perfil
> **Como** paciente,
> **Quiero** poder consultar mi información y modificar cualquier parámetro permitido por la aplicación,
> **Para** mantener mis datos actualizados y personalizados según mis necesidades.

**Comentarios**: 
- De aquí se deriva un requisito de edición de perfil. 
- Podría incluirse la opción de añadir información médica relevante si la plataforma lo considera útil.

**Criterios de aceptación**: TODO

---

## HP-007: Reembolso en caso de cancelación del fisioterapeuta 
> **Como** paciente,
> **Quiero** que, una vez transcurrido el límite de cancelación, si el fisioterapeuta cancela la consulta, recibir un reembolso del coste de esta,
> **Para** no perder el dinero de la consulta.

**Comentarios**: 
- Por defecto, el límite de cancelación estará puesto en 48 horas.	

**Criterios de aceptación**: TODO

---

## HF-001: Registro como fisioterapeuta
> **Como** fisioterapeuta,
> **Quiero** poder registrarme en la plataforma proporcionando mis datos personales y profesionales,
> **Para** validar mi perfil y comenzar a ofrecer mis servicios.
> Los datos requeridos para el registro son:
> - Nombre
> - Apellidos
> - Correo electrónico
> - Contraseña
> - Colegio profesional
> - Número de colegiado

**Comentarios**: 
- El sistema deberá verificar que el fisioterapeuta está debidamente colegiado en España mediante la base de datos oficial de colegios y colegiados. Solo tras esta validación podrá continuar con el - proceso de registro. 
- Antes de finalizar el registro, el fisioterapeuta deberá seleccionar uno de los dos planes de suscripción disponibles (Fisio Blue o Fisio Gold). 
- Se podría considerar la opción de permitir la subida de documentación adicional para casos en los que la verificación automática falle. 
- Podría añadirse la opción de probar la plataforma antes de elegir un plan definitivo. 

**Criterios de aceptación**: TODO

---

## HF-002: Personalización del perfil de fisioterapeuta 
> **Como** fisioterapeuta, una vez registrado en el sistema,
> **Quiero**poder personalizar mi perfil modificando la siguiente información,
> **Para**que los pacientes puedan conocer mejor mis servicios y experiencia.
> Los datos editables incluyen:
> - Foto de perfil
> - Especialidad 
> - Descripción (bio) 
> - Información del título 
> - Cursos y certificaciones 
> - Teléfono de contacto 
> - Código postal 
> - Clínica (si aplica) 
> - Número de cuenta bancaria para recibir ingresos de consultas 
> - Disponibilidad horaria 
> - Precios de consulta (incluyendo la opción de ofrecer la primera consulta gratis) 
> - Tipos de servicios y bonos (Ejemplos:) 
>   - Consulta de valoración (opcionalmente gratuita) 
>   - Sesiones semanales durante 3-6 meses 
>   - Dos sesiones por semana durante X meses 
>   - Una sesión cada quince días durante X meses 
> - Archivos personalizados, como cuestionarios y herramientas específicas para el tratamiento de los pacientes


**Comentarios**: 
- Podría incluirse la opción de desactivar temporalmente la disponibilidad sin eliminar los datos. 
- Se recomienda permitir una vista previa del perfil para comprobar cómo lo ven los pacientes. 

**Criterios de aceptación**: TODO

---

## HF-003: Agenda y calendario 
> **Como** fisioterapeuta,
> **Quiero** poder acceder a un calendario donde se muestren mis citas agendadas y tener la posibilidad de modificar mi disponibilidad horaria
> **Para** gestionar mi agenda de manera eficiente.

**Comentarios**: 
- Podría añadirse la opción de establecer pausas o días bloqueados en la disponibilidad. 
- Se recomienda una vista semanal y mensual para una mejor planificación. 

**Criterios de aceptación**: TODO

---

## HF-004: Aceptación, rechazarla y modificación de citas   
> **Como** fisioterapeuta,  
> **Quiero** poder consultar el estado de una cita solicitada y poder aceptarla, rechazarla o solicitar una modificación de fecha y hora, notificando al paciente sobre cualquier cambio.   
> **Para** gestionar de manera eficiente mi agenda.

**Comentarios**: 
- Se podría incluir un sistema de notificación que recuerde al fisioterapeuta sobre citas pendientes de aceptar o modificar. 
- Podría añadirse una opción para realizar un seguimiento del historial de citas modificadas o rechazadas. 

**Criterios de aceptación**: TODO
   
---

## HF-005: Valoración del fisio
> **Como** fisioterapeuta,  
> **Quiero** que los pacientes puedan evaluar la consulta realizada y dejar comentarios en mi perfil,
> **Para** que futuros pacientes puedan tener referencias de mi trabajo.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HF-006: Personalización de herramientas  
> **Como** fisioterapeuta,  
> **Quiero** ener un espacio donde poder personalizar los tests y cuestionarios plantilla ofrecidos por la plataforma,   
> **Para** ofrecer un servicio personalizado a mis pacientes.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HF-007: Cuestionario preintervención   
> **Como** fisioterapeuta,  
> **Quiero** que antes de confirmar la cita de un paciente, esté obligado a rellenar un cuestionario preintervención,   
> **Para** conocer el motivo de la consulta y sus hábitos para realizar un diagnóstico previo.

**Comentarios**: 
- En este cuestionario es donde se debería incluir la herramienta del mapa de dolor, por ejemplo. 
- El cuestionario varía según la especialidad del fisio. 

**Criterios de aceptación**: TODO

---

## HF-008: Pago previo de la consulta
> **Como** fisioterapeuta,  
> **Quiero** que el paciente abone de antemano el precio de la consulta,   
> **Para** garantizar el compromiso del paciente.

**Comentarios**: 
- Aunque esta podrá ser cancelada hasta 48 horas antes y se realizará un reembolso del mismo.

**Criterios de aceptación**: TODO

---

## HF-009: Registro de facturas 
> **Como** fisioterapeuta,  
> **Quiero** que el sistema genere una factura por cada consulta realizada y que se almacenen en el sistema,  
> **Para** que pueda consultarlas y descargarlas.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---


## HF-010: Videollamada  
> **Como** fisioterapeuta,  
> **Quiero** poder iniciar la consulta con un paciente desde mi agenda de citas,  
> **Para** iniciar la videollamada.

**Comentarios**:
- La videollamada podrá incluir un temporizador para saber el tiempo restante de consulta y que este tiempo no se exceda.  
- La llamada no podrá finalizar hasta que haya transcurrido un 75% del tiempo destinado a la consulta.  

**Criterios de aceptación**: TODO

---



## HF-011: Herramientas en la videollamada 
> **Como** fisioterapeuta,  
> **Quiero** poder tener acceso durante el transcurso de la videollamada a las siguientes herramientas y poder modificar la información que se requiera:
> - Historial clínico del paciente almacenado en el sistema
> - Compartir pantalla
> - Modelo anatómico 3D
> - Plantillas de test y cuestionario
> - Mis cuestionarios personalizados    
> **Para** recoger y almacenar información del paciente, así como ilustrarle con diapositivas o el modelo anatómico 3D la información que considere necesaria para enseñarle el por qué de su patología y el por qué de su tratamiento.

**Comentarios**:
- Las herramientas de test y cuestionarios deberían concebirse como Google Forms, es decir, cuestionarios personalizables. Nosotros tendremos digitalizados en el sistema los mapas de dolor, las escalas de evaluación, etc., y estas podrán ser insertadas en los cuestionarios y tests. 

**Criterios de aceptación**: TODO

---

## HF-012: Archivos en la nube 
> **Como** fisioterapeuta,  
> **Quiero** poder modificar los vídeos subidos en mi espacio personal y darle acceso a los pacientes que correspondan,   
> **Para** que pueda consultar en cualquier momento cómo se realiza un ejercicio o para que tengan acceso a alguna explicación que quiera ofrecerle.

**Comentarios**:
- Se podría considerar la posibilidad de que, por ejemplo, en las planificaciones de ejercicio, un ejercicio ya esté asociado a un vídeo explicativo de la nube del profesor. 

**Criterios de aceptación**: TODO

---

## HF-013: Test y cuestionarios 
> **Como** fisioterapeuta,  
> **Quiero** disponer de plantillas de test, cuestionarios y prescripción de ejercicios,   
> **Para** valuar a mis pacientes, personalizar los tratamientos y almacenarlos en mi espacio dentro de la plataforma para tenerlos siempre disponibles.
> - Tipos de plantillas disponibles:
>   - Test de valoración(Lista de test específicos a definir: X) 
> - Cuestionarios (Lista de cuestionarios específicos a definir: X)
> - Plantilla para prescripción de ejercicios
>   - Datos del paciente:
>     - Nombre
>     - Diagnóstico
>     - Frecuencia de realización de ejercicios
>     - Tiempo estimado de la sesión
>     - (Opcional) Hora recomendada para realizar los ejercicios (esto permitirá que la aplicación envíe notificaciones de recordatorio, ajustables posteriormente por el paciente en su sección de tratamiento/seguimiento).
>   - Detalles del ejercicio:
>     - Nombre
>     - Objetivo (por ejemplo, fortalecimiento de peroneos en caso de esguince)
>     - Descripción del ejercicio (posibilidad de incluir enlace a un vídeo subido por el fisioterapeuta)
>     - Material necesario
>     - Series, repeticiones y carga
>     - Método de evaluación (ejemplo: escala EVA, escala Tinetti, etc.)

**Comentarios**:
- Se podría permitir la creación de test y cuestionarios personalizados desde cero.
- Sería útil que el paciente pudiera completar los cuestionarios directamente en la plataforma para que el fisioterapeuta reciba los resultados automáticamente.
- Para consultar los tipos de tests: https://centromotionis.com/escalas-de-valoracion-en-fisioterapia/  

**Criterios de aceptación**: TODO

---

## HF-014: Seguimiento    
> **Como** fisioterapeuta,  
> **Quiero** disponer de un apartado en la plataforma que me permita acceder al seguimiento de todos los pacientes que tengo en activo,  
> **Para** poder consultar su progreso e informes sobre cómo están respondiendo al tratamiento, si lo están realizando, etc.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO
 
---

## HF-015: Recordatorios de consultas   
> **Como** fisioterapeuta,  
> **Quiero** poder recordarle a mi paciente cuándo tiene agendada una consulta,  
> **Para** que no se le olvide o para que la cancele a tiempo si así lo desea.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO
 
---

## HF-017: Compartir archivos clínicos   
> **Como** fisioterapeuta,  
> **Quiero** poder recibir archivos de mis pacientes, principalmente imágenes de diagnóstico (ecografías, radiografías, etc.) y que se almacenen en un lugar de su perfil de pacientes al que yo pueda acceder,  
> **Para** consultarlos en cualquier momento y tomar decisiones sobre su valoración y tratamiento.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HF-018: Accesibilidad 
> **Como** fisioterapeuta,  
> **Quiero** que la aplicación sea accesible, especialmente para personas con discapacidad que suelen constituir un gran porcentaje de los pacientes, 
> **Para** ofrecer un servicio inclusivo a todos los perfiles de usuarios de la plataforma.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---

## HF-019: Chat
> **Como** fisioterapeuta,  
> **Quiero** ener acceso a un chat durante la videollamada con el paciente,  
> **Para** poder garantizar una comunicación fluida y eficiente en caso de problemas técnicos, aclaraciones o envío de indicaciones sin interrumpir la sesión verbalmente.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO
---

## HA-001: Administración de sistema  
> **Como** administrador,  
> **Quiero** poder gestionar los usuarios, fisioterapeutas, citas y configuración general del sistema,  
> **Para** asegurar el correcto funcionamiento del servicio y garantizar una buena experiencia tanto para los fisioterapeutas como para los pacientes.

**Comentarios**: 
- Se podría incluir un sistema de alertas para notificar al administrador sobre incidencias críticas. 
- Puede ser útil agregar roles con diferentes niveles de permisos dentro del panel de administración. 

**Criterios de aceptación**:
- Gestión de usuarios: 
  - Visualizar y administrar los perfiles de pacientes y fisioterapeutas. 
  - Activar, suspender o eliminar cuentas según las políticas de la plataforma. 
  - Gestionar solicitudes de verificación de fisioterapeutas. 
- Gestión de citas: 
  - Monitorear citas programadas, canceladas y completadas. 
  - Intervenir en disputas entre pacientes y fisioterapeutas si es necesario. 
- Gestión de pagos y suscripciones: 
  - Supervisar pagos realizados en la plataforma.
  - Administrar planes de suscripción (Fisio Blue y Fisio Gold).
  - Gestionar solicitudes de reembolsos o problemas de facturación. 
- Configuración general del sistema:
  - Modificar términos y condiciones de uso.
  - Configurar parámetros generales de la plataforma (horarios, políticas, etc.).
  - Administrar bases de datos de colegios y colegiados para la validación de fisioterapeutas.
- Gestión de contenido:
  - Administrar plantillas de test, cuestionarios y ejercicios.
  - Modificar información de ayuda, preguntas frecuentes y documentación. 
- Generación de reportes y análisis:
  - Generar reportes sobre la actividad de la plataforma (citas realizadas, cancelaciones, ingresos, etc.).
  - Analizar métricas de uso para mejorar la experiencia de los usuarios. 

---

## HA-002: Formación del equipo 
> **Como** administrador de la plataforma,  
> **Quiero** poder formar a mi equipo de desarrollo en las tecnologías decididas por el equipo de planificación,  
> **Para** asegurar un buen arranque del proyecto..

**Comentarios**: 
- MongoDB
- NextJS
- Djagno Rest 

**Criterios de aceptación**: TODO

---

## HA-003: Landing page  
> **Como** administrador de la plataforma,  
> **Quiero** poder disponer de una landing page para poder indexar en los motores de búsqueda, y que al iniciar sesión redirija a la plataforma,
> **Para** asegurar un buen posicionamiento en el SEO.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**: TODO

---


