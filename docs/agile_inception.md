---
title: "AGUILE INCEPTION"                       
subtitle: "FISIOFIND"
author: [Miguel Encina Martínez, Daniel Tortorici, Francisco Capote García] 
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
header-left: "AGUILE INCEPTION"                 
header-right: "05/02/2025"                                         
footer-left: "FISIOFIND"
documentclass: scrartcl
classoption: "table"
mainfont: "Noto Sans"
sansfont: "Noto Sans"
monofont: "Noto Sans Mono"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIOFIND  -  AGULE INCEPTION
</p>

<br>

**Índice**
- [1. RESUMEN](#1-resumen)
- [2. PROBLEMA PRINCIPAL Y RELEVANCIA](#2-problema-principal-y-relevancia)
- [3. CONTEXTO Y CIRCUNSTANCIAS](#3-contexto-y-circunstancias)
- [4. NECESIDADES DEL PROYECTO](#4-necesidades-del-proyecto)
- [5. ARQUITECTURA DE LA APP](#5-arquitectura-app)
  - [5.1. CORE](#51-core)
  - [5.2. MÓDULOS EXTRA (ADDONS)](#52-módulos-extra-addons)
  - [5.3. FUERA DEL SCOPE](#53-fuera-del-scope)
- [6. USUARIOS OBJETIVO](#6-usuarios-objetivo)
- [7. MONETIZACIÓN](#7-monetización)
- [8. COSTE ESTIMADO](#8-coste-estimado)
- [9. IMPLEMENTACIÓN Y JUSTIFICACIÓN DE APP](#9-implementación-y-justificación-de-app)
- [10. IMPACTO ESPERADO](#10-impacto-esperado)
- [11. COMPETIDORES POTENCIALES](#11-competidores-potenciales)
  - [11.1. GVAM / SITUM](#111-gvam--situm)
  - [11.2. SMARTIFY](#112-smartify)
  - [11.3. EXPLORE - AMNH OFFICIAL APP](#113-explore---amnh-official-app)
  - [11.4. OTROS COMPETIDORES](#114-otros-competidores)
- [12. DIFERENCIACIÓN DEL PROYECTO](#12-diferenciación-del-proyecto)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIOFIND

- **Autores:** Miguel Encina Martínez, Daniel Tortorici Bartús, Francisco Capote García

- **Fecha de Creación:** 12/02/2025  

- **Versión:** v1.2

<br>

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 12/02/2025 | v1.0    | Miguel Encina Martínez           | Primera versión de los apartados: Resumen, Problema Principal y Relevancia, Contexto y Circunstancias, Necesidades del Proyecto |
| 12/02/2025 | v1.1    | Daniel Tortorici Bartús          | Primera versión de los apartados: 6. Usuarios Objetivo y 10. Impacto Esperado|
| 12/02/2025 | v1.2    | Francisco Capote García          | Eliminado Gallery Guide de resumen y de necesidades del proyecto, Actualizada la arquitectura app, Actualizada la implementacion y justificacion de la app,  corregido pequeños errores |


<br>

<br>


<br>

<br>


# **1. RESUMEN**

**FisioFind es una aplicación especialidada para fisioterapeutas que ofrece todo tipo de servicios esenciales para el día a día de estos especialistas de una forma cómoda, eficiente y familiar**. A diferencia de la competencia, nos centramos en la opción de realizar consultas on-line con los pacientes proporcionando facilidades tanto para especialistas como para los pacientes.

# **2. PROBLEMA PRINCIPAL Y RELEVANCIA**
Este proyecto aborda la evidencia de que la fisioterapia on-line es igual de efectiva que la consulta presencial. La mayoría de las especialidades en el ámbito sanitario, disponen ya de consultas on-line y herramientas orientadas a ello. A menudo, se asocia al fisioterapeuta exclusivamente con la realización de tratamientos físicos para aliviar el dolor o la fatiga muscular, cuando en realidad, esto es solo una herramienta más. 

Por eso, surge la necesidad de ofrecer al fisioterapeuta un software que contenga todas las herramientas propias de estos especialistas, que se puedan realizar de forma on-line, sin tener que acudir a una clínica física, para así ahorrar tiempo, esfuerzo y dinero para ambas partes. Además ofrece la posibilidad para darse a conocer a nuevos fisioterapeutas que quieran aprovechar de nuestras ventajas.

# **3. CONTEXTO Y CIRCUNSTANCIAS**
Esta solución está basada en el siguiente contexto:

-	Evidencia de que la fisioterapia online es igual de efectiva que la consulta presencial.
-	El fisioterapeuta es un profesional sanitario que trata la pérdida de funcionalidad que realizan las estructuras del cuerpo derivadas de lesiones óseo-neuromusculares; es decir, se centran en averiguar la causa de una patología que altera la función. Para recuperar la función que se ve perdida en una patología hay que tratar la función a través del movimiento. 
-   Las medidas “tradicionales” de tratamiento que se conciben como propias de este sector (terapia manual masajes, electro punción, etc.) son en realidad herramientas analgésicas que no tratan la recuperación de la funcionalidad. 
-	Las herramientas de valoración que más evidencia científica tienen es la entrevista clínica y los cuestionarios. Los tests ortopédicos los puede realizar el paciente de forma autónoma. La palpación no es un método fiable de valoración.
-	Actualmente la medida más popular es promocionarse en redes sociales. Es necesario una plataforma para DARSE a conocer. 
-	Hay personas que no tienen un acceso fácil a clínicas de fisioterapia (zonas rurales, no tienen un horario que les permita atender a una cita presencial, etc.).


# **4. NECESIDADES DEL PROYECTO**
**¿Cómo se llegó a la necesidad de llevar a cabo el proyecto?**

Varios miembros del grupo disponen de personas cercanas que practican la profesión de la fisioterapia y surgió esta idea ante la necesidad común de todos ellos de disponer de un software especializado que pueda facilitar las tareas del día a día y que les ahorre tiempo, esfuerzo y dinero ofreciendo esta alternativa a la gran cantidad de consultas presenciales a las que se enfrentan semana tras semana.


# **5. ARQUITECTURA DE LA APP**

## **5.1. CORE** 

**PARA FISIOTERAPEUTAS**
- Digitalización del cuerpo humano y mapas de dolor:
    - Mientras el cliente y fisioterapeuta se encuentra en videollamada, el cliente tendra la opcion de mostrar mediante un mapa virtual del cuerpo humano las areas donde sufre dolor o molestia, mejorando la comunicacion y facilitando asi al fisioterapeuta entender al cliente.

- Sistema de agendas y gestion de citas:
    - Los fisioterapeutas podrán administrar sus citas de forma flexible, optimizando su disponibilidad y ajustando su horario según sus necesidades.

- Ejercicios prescritos con seguimiento de dolor y progreso:
    - Los fisioterapeutas podrán prescribir ejercicios personalizados para los pacientes, quienes podrán realizar un seguimiento de su progreso y nivel de dolor. El sistema permitirá registrar el avance de los ejercicios, evaluar la intensidad del dolor y ajustar el plan de tratamiento según sea necesario.
    
- Facturación automatizada y gestión de pagos:
    - El sistema generará facturas automáticamente tras cada consulta, facilitando la gestión financiera de los fisioterapeutas. Permitiendo pagos dentro de la aplicacion de forma segura mediante Stripe y un historial de transacciones.

- Perfil profesional verificado:
    - Los fisioterapeutas deberán completar un proceso de verificación para garantizar su autenticidad y credibilidad. Esto incluirá la validación de certificaciones, experiencia y especialidades, asegurando confianza y calidad en el servicio.

**PARA PACIENTES**

- Búsqueda y reserva de fisioterapeutas por especialidad:
    - Los pacientes podrán buscar fisioterapeutas según su especialidad, ubicación y valoraciones. El sistema permitirá filtrar opciones y reservar citas de manera rápida y sencilla.

- Historial de consultas y plan de tratamiento personalizado:
    - Los pacientes tendrán acceso a su historial completo de consultas y tratamientos previos. Esto incluirá ejercicios recomendados, progreso y seguimiento de su evolución, asegurando un enfoque continuo y personalizado en su recuperación.

- Videoconsultas seguras con cuestionario previo:
    - Las videoconsultas se realizarán de manera segura con tecnología encriptada. Antes de la consulta, los pacientes deberán completar un cuestionario previo para proporcionar información relevante sobre su condición, permitiendo al fisioterapeuta una evaluación más precisa y eficiente durante la sesión.

- Valoraciones y seguimiento de pacientes:
    - Los pacientes podrán calificar y dejar reseñas sobre sus sesiones, ayudando a mejorar la reputación de los fisioterapeutas. Además, el sistema permitirá un seguimiento detallado del progreso del paciente, incluyendo historial de consultas, evolución del tratamiento y reportes de mejora.


## **5.2. MÓDULOS EXTRA (ADDONS)**

- Implementacion de clinicas para la gestion del personal

## **5.3. FUERA DEL SCOPE**

- ❌ No contiene infraestructura mas haya de la aplicacion y tampoco contiene integración con Dispositivos IoT o Sensores Externos.


# **6. USUARIOS OBJETIVO**
# **Meet your Neighbours (La comunidad)**

- Pacientes
    - Obtienen la ayuda necesaria para su bienestar y salud por parte de un experto.
    - Comunican a través de herramientas completas sus necesidades específicas.
    - Reciben un seguimiento del tratamiento.
    - Acceden al registro de ejercicios y movimientos pautados.
    - Buscan y filtran a los profesionales por especialidad, ubicación y disponibilidad.

- Fisioterapeutas
    - Gestionan sus perfiles y certificados.
    - Hacen uso de la agenda integrada con gestión de citas.
    - Proporcionan consultas on-line personalizadas a los pacientes.
    - Se comunican con sus clientes a través de mensajes y archivos enviados por el chat.
    - Gestionan los pagos con los clientes.
    - Visualizan las valoraciones y comentarios asociados a sus perfiles.

- Desarrolladores
    - Mantener la aplicacion actualizada y eficiente.
    - Implementar las herramientas necesarias para la correcta ejecución de las consultas.

# **7. MONETIZACIÓN**
Hemos decidido ofrecer un Software as a Service a partir de planes mensuales. Estos planes dependerán del tamaño del museo. A partir de una investigación hemos podido recopilar los siguientes datos sobre algunos museos:
- Bellas artes: 14 salas, 7,775 m<sup>2</sup>
- Louvre: cerca de 300 salas, 210,000 m<sup>2</sup>
- Museo Nacional Centro de Arte Reina Sofía: 84,048 m<sup>2</sup>

Las fuentes de estos datos son planos oficiales de los museos o o consultadas directamente desde *Wikipedia*.

A partir de estos datos, en un primer momento hemos decidido ofrecer los siguientes planes para las entidades privadas:

- **Menos de 14 salas** (14 salas NO incluido): **200 euros** mensuales + componentes no incluidos elegidos.
  - Incluye el core más 2 componentes extra.
  - Cada componente extra elegido suma 50 euros al precio mensual.

- **Entre 14 y 30 salas**: **300 euros** mensuales + componentes no incluidos elegidos.
  - Incluye el core más 1 componente extra.
  - Cada componente extra elegido suma 100 euros al precio mensual.

- **Entre 30 y 50 salas**: **500 euros** mensuales + componentes no incluidos elegidos.
  - Incluye solo el core.
  - Cada componente extra elegido suma 200 euros al precio mensual.

- **Más de 50 salas**: deben de contactar con nosotros para ofrecer una solución o precio personalizado.

Sin embargo, si hiciera falta participar en concurso público para dar nuestros servicios, el plan y de este modo el contrato se deberá de hacer a medida. Asimismo, el precio y las condiciones serían a medida.

# **8. COSTE ESTIMADO** 
Haced una estimación de las horas que vamos a hacer (10h semanales x semanas x 17 personas x X€/hora).


# **9. IMPLEMENTACIÓN Y JUSTIFICACIÓN DE LA APP**

**Qué vamos a hacer nosotros (Por qué una APP)**

Mediante una aplicacion on-line los fisioterapeutas son capaces de asistir a sus clientes sin necesidad de realizar la consulta presenciales, por lo que una aplicacion capaz de realizar este funcion puede ser clave.

Hemos recibido la motivacion de varios fisioterapeutas cercanos a nosotros, ya que estarian totalmente de acuerdo de utilizar la aplicacion

**Tecnologías y Herramientas Clave**

- Dispositivos móviles

- Web

- React Native

- Django

- PostgreSQL


# **10. IMPACTO ESPERADO**

- Gran mejora de la situación actual de los tratamientos fisioterapéuticos on-line.

- Aumento de la comodidad de las consultas tanto para fisioterapeutas como para los pacientes.

- Reducción de problemas y tiempos excesivos de transporte para de los pacientes.

- Facilidad de trabajo para los fisioterapeutas con recursos limitados o corta experiencia.

- Automatización de la gestión de citas, calendario y pagos.

- Centralización de los datos y contacto entre clientes y expertos.



# **11. COMPETIDORES POTENCIALES**

## **11.1. GVAM / SITUM**

### **Puntos fuertes:**

1. Situm ofrece la geolocalización dentro del establecimiento mediante una tecnología innovadora (*Indoor Maps*), para poder localizar determinados elementos dentro del recinto.

2. GVAM ofrece soluciones software a los museos donde poder incluir audioguías, recomendadores de contenido, ayudas de ubicación y recreaciones virtuales:
    - Ofrece servicios adicionales como posibles actividades de entretenimiento antes y después de la visita (hoteles, restaurantes).
    - También ofrece soluciones para poder gestionar y actualizar guías interactivas.
    - Ofrece audioguías completas relativas a una ruta, ya sea determinada por ellos o por el propio museo.

### **Monetización:**  
- Parece ofrecer soluciones personalizadas a los diferentes museos interesados en servicios y mejoras específicas.

---

## **11.2. SMARTIFY**

### **Puntos fuertes:**

1. Aplicación donde se pueden adquirir entradas para una gran cantidad de museos o puntos culturales.

2. Ofrece audioguías de muchos museos, tanto gratuitas como de pago.

3. Tiene una sección de recomendaciones de exposiciones temporales, guías de arte por época y obras destacadas cercanas al usuario.

4. Ofrece una tienda de *merchandising* relacionado con el arte.

5. Dispone de un sistema de búsqueda por el nombre de la obra o autor, y muestra en qué museo se encuentra, con redirección para comprar las entradas.

6. Identifica obras de arte online.

### **Monetización:**  
- Venta de entradas, acordada mediante un modelo de *split* económico con los museos.  

- Venta de productos de *merchandising*.

---

## **11.3. EXPLORE - AMNH OFFICIAL APP**

### **Puntos fuertes:**
1. Es la aplicación oficial del museo.

2. Tiene un mapa digitalizado interactivo del plano del museo, incluyendo puntos de interés y obras.

3. Cuenta con un sistema de geolocalización dentro del museo: Sistema para localizar elementos como parkings, estaciones, cargadores, escaleras y ascensores, guiando al usuario mediante un sistema similar a un GPS.

4. Incluye la opción de comprar entradas y gestionar las membresías del museo.

5. Sistema de preferencias de obras para priorizar la información mostrada en el mapa interactivo.

6. Sección de información general del museo: entradas, horarios, etc.

7. Configuración para limitar recursos como notificaciones, uso de la ubicación, etc.

8. Sistema de feedback anónimo sobre la experiencia del usuario.

9. Para cada obra ofrece información y una sección interactiva con datos curiosos en forma de trivias.


### **Monetización:**  
- Al ser una aplicación propia del museo, la monetización proviene directamente de la venta de entradas y membresías a través de la aplicación.

---

## **11.4. OTROS COMPETIDORES**

Existen numerosas aplicaciones que ofrecen guías de visita estáticas de museos específicos, algunas con mapas breves o rutas predefinidas establecidas por el creador. En general, estas rutas no se generan dinámicamente según los intereses y el tiempo del usuario. También hay aplicaciones que recopilan obras de arte de varios museos, y algunas incluyen audioguías limitadas.

- [Muchas de las aplicaciones dirigidas a museos](https://evemuseografia.com/2023/12/30/mejor-software-para-museos-en-2023/): Se basan simplemente en gestión de inventario/ventas/visitantes:
    - [Coeli](https://www.coeli.cat/es/): Gestión de colecciones.
    - [Booking kit](https://bookingkit.com/es/industry/museos/): Venta de entradas.
    - [Intuiface](https://es.intuiface.com/museums-digital-signage): Para pantallas táctiles estáticas.

- [Rotas Art](https://www.rotas.com):
    - Tiene cierta personalización de la ruta. 
    - Obtiene todos los datos de las obras.
    - La funcionalidad del mapa no parece la más desarrollada.

- [Museo altamira](https://play.google.com/store/apps/details?id=com.gvam.altamira&hl=es): Es solo de altamira.

- [tuinbit](https://tuinbit.com/app-de-audioguias-para-museos/): 
    - Todo incluido pero solo audioguías.
    - Tiene funcionalidad de anuncios.

- [Museos virtuales](https://ecobnb.es/blog/2021/07/museos-virtuales-mundo-online-visitar-gratis/) y [Google Arts](https://www.juntadeandalucia.es/organismos/culturaydeporte/areas/cultura/museos-arte/vistas-virtuales.html): Permite visitas virtuales pero parece no dejar crear rutas.




# **12. DIFERENCIACIÓN DEL PROYECTO**

**Elementos a Tener en Cuenta:**
- No parece existir un monopolio o una competencia con un gigantesco nivel técnico o de influencia en el sector.

- **Gallery Guide** se encuadra en el sector **Service and Innovation** (similar a *Netflix*).

**Razones por las cuales no pertenecemos a los otros modelos:**
- No somos una aplicación basada en el *matchmaking* como Airbnb o Uber, ya que no conectamos personas para satisfacer servicios específicos.

- No es un proyecto de servicio que utilice la monetización basada en los datos de los usuarios, como *LinkedIn*.


**Razones por las cuales nos parecemos a Netflix:**
- ✔ Es un servicio digital innovador que mejora la experiencia del usuario dentro del museo.  

- ✔ Su valor está en la optimización de rutas personalizadas y la digitalización del museo.  

- ✔ No monetizamos a los usuarios finales como LinkedIn, sino que vendemos directamente la solución a los museos como un servicio adaptable.


