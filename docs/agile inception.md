# Resumen aplicación en 50 palabras

Gallery Guide es una aplicación personalizada para museos que permite planificar rutas óptimas según el tiempo o las preferencias del visitante. A diferencia de visitas guiadas en tiempo real o audioguías, ofrecemos un mapa digitalizado como grafo y recomendaciones inteligentes, optimizando cada recorrido. Es una solución escalable y adaptable a las necesidades de cada museo.

# Problema Principal y Relevancia
El proyecto aborda la carencia de una herramienta digital generalizada que permita a los visitantes de museos planificar rutas óptimas basadas en criterios persoanlizados. La propuesta busca mejorar la experiencia del visitante y optimizar el tiempo dedicado en museos de gran tamaño o compleja estructura

## Contexto y Circunstancias:
Esta solución está basada en el siguiente contexto:

- La mayoría de las personas llevan consigo dispositivos inteligentes
- Las visitas a los museos pueden dificultarse dependiendo de las dimensiones y del aforo que este tenga.
- Los mapas se convierten en una herramienta facilmente exportable a estructuras matemáticas como grafos, que mediante herramientas matemáticas, calcular rutas óptimas se convierte en algo sencillo.

La solución se basa en la estrategia Software Product Line (SPL) lo que permite ofrecer un conjunto de funcionalidades básicas (core) y módulos adicionales personalizables según los requisitos de cada museo

## ¿Cómo se llegó a la necesidad de llevar a cabo el proyecto?
Un compañero vivió esta problemática en primera persona durante su visita al Museo del Louvre, donde se sintió perdido al no disponer de una herramienta que le permitiera planificar una ruta óptima según su tiempo y preferencias.
# SPL
## Core 

- Digitalización del mapa del museo:
    - Representacion de las salas como nodos en un grafo interactivo, unidos con aristas con un peso (tiempo invertido por sala) y con obras en cada nodo (con sus conjuntos de metadatos que requiera el cliente)
- Sistema de creación de rutas:
    - Generación de rutas optimizadas en función de nodos, preferencias de los usuarios o tiempo disponible
- Descripción de los nodos:
    - Cada sala tiene un listado de las obras presentes en dicha sala, y una descripción de dicha obra (No ofreceríamos la ficha técnica a priori)
- Gestión de los usuarios (No es una red social):
    - Marcar tus gustos (favoritos, que me gusta, que no me gusta)
    - Los usuarios se registran y pueden guardar sus rutas 
    - Los usuarios pueden llevar el porcentaje de salas visitadas del museo (Incitamos a conseguir el 100%!)
    - En base a las rutas hechas, las salas visitadas, ofrecemos una personalización aún mayor (las rutas de arriba pueden hacerse como usuario anónimo)
    - Crea tu propia ruta y genera un enlace para compartirse (como cuando compartes un mazo en el clash royale, no se sube a ningún foro)
- Administradores:
    - Rutas predeterminadas
    - Fácil gestión de sus salas (modificar los nodos y las obras que tiene dentro)

## Módulos extra (Addons)

- Módulo Social:
    - Publicacion de las rutas en un portal público
    - Valoracion y puntuación de rutas por otros usuarios.
    - Discusión (foro) por sala y obra.
    - Identificación de rutas más populares o menos recorridas
- Módulos de anuncios oficiales:
    - Espacio para que el museo publique anuncios
    - Log y anuncios de cambios en el museo (Esta obra pasa a X sala, nueva exposición X...).

- Módulos de integraciones propias:
    - Hemos llamado a este módulo así porque nos referimos a integrar cosas que ellos ya tienen, como por ejemplo, venta de entradas, colección de obras o una integración de una tienda

- Este módulo se nos acaba de ocurrir (Módulo Trivia):
    - Para hacerlo más dinámico proponer un trivial de preguntas, foto y preugnta de cuál es esta obra, yo qué se...

## Fuera del scope

- No es una audioguía o visita guiada
- No es una visita virtual inmersiva ni con reconstrucción 3D
- No es una aplicación que te ubique en tiempo real, más bien es para planificar.
- No gestiona el aforo o la afluencia del museo

# Meet your Neighbours(La comunidad)

- Visitantes del museo:
    - Planifican rutas personalizadas basadas en su tiempo y preferencias
    - Guardan rutas 
    - Almacenan % de museo visitado
    - Reciben recomendaciones
- Museos (administradores)
    - Gestionan el contenido del mapa digital, salas, obras y rutas predeterminadas
    - Eligen sobre los módulos opcionales
    - Quedamos abiertos a solicitudes que necesiten. (Como tenemos el core, somos escalables, si el addon no lo consideramos inicialmente)
- Desarrolladores
    - Mantener el core actualizado y eficiente, así como los addons predeterminados.
    - Implementar nuevas funcionalidades específicas para los requisitos de los museos

## Monetización
No se que poner, pero se vende a los clientes directamente, no sacamos rentabilidad por el uso de la aplicación como tal, si no que sería una inversión en la que vamos a diseñar el piloto e intentariamos venderselo a los clientes básicamente... No planteamos planes de precios a priori... Si nos lo tumban, la idea el SPL, pues optaremos por el uso de datos libres y hacemos una aplicacion con estética propia que básicamente haría lo mismo. Es decir, cogeriamos los datos, y hariamos la aplicacion... Es un poco lio todavía, pero tenemos que suponer que tenemos una inversión inicial, además la justificación clara es que no nos están pagando, entonces "for fun" queremos diseñar esto modo piloto y ¿cómo ganaríamos dinero?, vendiendo la solución, fácil.

## Coste 
Haced una estimación de las horas que vamos a hacer (10h semanales x semanas x 17 personas x X€/hora)


## Qué vamos a hacer nosotros ( Por qué un SPL )

Integraremos una versión con el CORE con datos de prueba, optamos por el SPL porque queremos ofrecer un servicio personalizado a cada cliente. 

Como primer cliente ficticio usaremos los datos del Louvre, que son públicos para demostrar todas las capacidades de Gallery Guide como solución software

## Tecnologías y Herramientas Clave

- Dispositivos móviles
- SPL
- React Native
Añadid las palabras que se os ocurran

## Impacto Esperado

- Mejora de la satisfacción del visitante al permitirle optimizar su recorrido.
- Reducción del tiempo perdido buscando obras o salas específicas.
- Posibilidad de que los museos monitoreen patrones de comportamiento y ajusten la oferta de rutas o exposiciones en base a los datos recolectados.
- Mayor flexibilidad para los museos, que podrán personalizar la aplicación con módulos según sus necesidades sin afectar al core del sistema.

# **Competidores Potenciales**

## **GVAM / Situm**
### **Puntos fuertes:**
1. Situm ofrece la geolocalización dentro del establecimiento mediante una tecnología innovadora (*Indoor Maps*), para poder localizar determinados elementos dentro del recinto.
2. GVAM ofrece soluciones software a los museos donde poder incluir audioguías, recomendadores de contenido, ayudas de ubicación y recreaciones virtuales:
    - **2.1:** Ofrece servicios adicionales como posibles actividades de entretenimiento antes y después de la visita (hoteles, restaurantes).
    - **2.2:** También ofrece soluciones para poder gestionar y actualizar guías interactivas.
    - **2.3:** Ofrece audioguías completas relativas a una ruta, ya sea determinada por ellos o por el propio museo.

### **Monetización:**  
- Parece ofrecer soluciones personalizadas a los diferentes museos interesados en servicios y mejoras específicas.

---

## **Smartify**
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

## **Explore - AMNH Official App**
### **Puntos fuertes:**
1. Es la aplicación oficial del museo.
2. Tiene un mapa digitalizado interactivo del plano del museo, incluyendo puntos de interés y obras.
3. Cuenta con un sistema de geolocalización dentro del museo:
    - **3.1:** Sistema para localizar elementos como parkings, estaciones, cargadores, escaleras y ascensores, guiando al usuario mediante un sistema similar a un GPS.
4. Incluye la opción de comprar entradas y gestionar las membresías del museo.
5. Sistema de preferencias de obras para priorizar la información mostrada en el mapa interactivo.
6. Sección de información general del museo: entradas, horarios, etc.
7. Configuración para limitar recursos como notificaciones, uso de la ubicación, etc.
8. Sistema de feedback anónimo sobre la experiencia del usuario.
9. Para cada obra ofrece información y una sección interactiva con datos curiosos en forma de trivias.

### **Monetización:**  
- Al ser una aplicación propia del museo, la monetización proviene directamente de la venta de entradas y membresías a través de la aplicación.

---

## **Otros Competidores:**
Existen numerosas aplicaciones que ofrecen guías de visita estáticas de museos específicos, algunas con mapas breves o rutas predefinidas establecidas por el creador. En general, estas rutas no se generan dinámicamente según los intereses y el tiempo del usuario. También hay aplicaciones que recopilan obras de arte de varios museos, y algunas incluyen audioguías limitadas.

- [Muchas de las aplicaciones dirigidas a museos](https://evemuseografia.com/2023/12/30/mejor-software-para-museos-en-2023/): Se basan simplemente en gestión de inventario/ventas/visitantes.
    - [Coeli](https://www.coeli.cat/es/): Gestión de colecciones.
    - [Booking kit](https://bookingkit.com/es/industry/museos/): Venta de entradas.
    - [Intuiface] (https://es.intuiface.com/museums-digital-signage): Para pantallas táctiles estáticas.
- [Rotas Art](https://www.rotas.com)
    - Tiene cierta personalización de la ruta. 
    - Obtiene todos los datos de las obras.
    - La funcionalidad del mapa no parece la más desarrollada.
- [Museo altamira](https://play.google.com/store/apps/details?id=com.gvam.altamira&hl=es): Es de altamira.
- [tuinbit](https://tuinbit.com/app-de-audioguias-para-museos/): 
    - Todo incluido pero solo audioguias.
    - Tiene funcionalidad de anuncios.
- [Museos virtuales](https://ecobnb.es/blog/2021/07/museos-virtuales-mundo-online-visitar-gratis/) y [Google Arts](https://www.juntadeandalucia.es/organismos/culturaydeporte/areas/cultura/museos-arte/vistas-virtuales.html): Permite visitas virtuales pero parece no dejar crear rutas.
---

# **Elementos a Tener en Cuenta:**
- No parece existir un monopolio o una competencia con un gigantesco nivel técnico o de influencia en el sector.
- **Gallery Guide** se encuadra en el sector **Service and Innovation** (similar a Netflix).

---

### **Razones por las cuales no pertenecemos a los otros modelos:**
- No somos una aplicación basada en el *matchmaking* como Airbnb o Uber, ya que no conectamos personas para satisfacer servicios específicos.
- No es un proyecto de servicio que utilice la monetización basada en los datos de los usuarios, como LinkedIn.

### **Razones por las cuales nos parecemos a Netflix:**
- ✔ Es un servicio digital innovador que mejora la experiencia del usuario dentro del museo.  
- ✔ Su valor está en la optimización de rutas personalizadas y la digitalización del museo.  
- ✔ No monetizamos a los usuarios finales como LinkedIn, sino que vendemos directamente la solución a los museos como un servicio adaptable.


