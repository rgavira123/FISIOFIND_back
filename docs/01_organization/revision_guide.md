---
title: "GUIA DE USO Y REVISIÓN"                           # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "11/03/2025"                                        # CHANGE IF NEEDED
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
header-left: "GUIA DE USO Y REVISIÓN"                     # CHANGE IF NEEDED
header-right: "11/03/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  GUIA DE USO Y REVISIÓN
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
  - [1.1 DEFINICIONES](#11-definiciones)
  - [1.2 TIPOS DE USUARIOS PILOTO](#12-tipos-de-usuarios-piloto)
- [2. CONDICIONES](#2-condiciones)
  - [2.1 CONDICIONES FORMALES](#21-condiciones-formales)
    - [2.1.1 CONDICIONES FORMALES PARA EL USUARIO PILOTO](#211-condiciones-formales-para-el-usuario-piloto)
    - [2.1.2 CONDICIONES FORMALES PARA FISIO FIND](#212-condiciones-formales-para-fisio-find)
  - [2.2 CONDICIONES INFORMALES](#22-condiciones-informales)
    - [2.2.1 CONDICIONES INFORMALES PARA EL USUARIO PILOTO](#221-condiciones-informales-para-el-usuario-piloto)
    - [2.2.2 CONDICIONES INFORMALES PARA *FISIO FIND*](#222-condiciones-informales-para-fisio-find)
  - [2.3 PERIODO DE PRUEBAS](#23-periodo-de-pruebas)
- [3. DATOS DE LAS PARTES Y FIRMA](#3-datos-de-las-partes-y-firma)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->


<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND
- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 1

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Delfín Santana Rubio, Antonio Macías Ferrera

- **Fecha de Creación:** 11/03/2025  

- **Versión:** v1.0

<br>

<!-- \newpage -->

<br>


---

**Historial de modificaciones**

| Fecha          | Versión  | Realizada por            | Descripción de los cambios                |
| -------------- | -------- | ------------------------ | ----------------------------------------- |
|  10/03/2025    | v1.0     | Antonio Macías Ferrera   | Versión inicial del documento             |
|  13/03/2025    | v1.2     | Delfín Santana Rubio   | Documento completado         |

<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

FISIOFIND es una plataforma de consulta en línea diseñada para conectar fisioterapeutas y pacientes. La aplicación permite la gestión de citas, realización de consultas virtuales y procesamiento de pagos, facilitando la organización y seguimiento de sesiones terapéuticas de forma segura y eficiente. La solución se orienta a dos grandes grupos de usuarios: fisioterapeutas y pacientes.

En este documento, se detalla una guía para el despliegue en local de la apliación además de un desglose en detalla para la realización de las prueba de los casos de uso principales (CORE UC).



<br>

<!-- \newpage -->

<br>


# 2. ACCESO A LA APLICACIÓN

Se podrá acceder a nuestra aplicación desplegada mediante el siguiente enlace: /TODO

Además, se podrá visitar nuestra landing page en la que nos publicitamos en: https://fisiofind.netlify.app/ 

Toda nuestra documentación actualizada en: https://fisiofind.vercel.app/ 

Y, nuestro repositorio en GitHub: https://github.com/Proyecto-ISPP/FISIOFIND 


Una vez en nuestra aplicación, se podrá acceder sin necesidad de iniciar sesión a nuestra página principal y realizar una primeras búsquedas de fisioterapeutas. De todas formas, para probar nuestras funcionalidades completas, facilitamos los siguientes credenciales:

/TODO DelfinSR

- Administrador del ssitema:

- Fisioterapeuta 1:

- Fisioterapeuta 2:

- Paciente 1: 

- Paciente 2: 


/ TODO link a videos demo, url de clockify


<br>

<!-- \newpage -->

<br>


# 3. DESCRIPCIÓN DE FUNCIONALIDADES NO TERMINADAS

No se han terminado las páginas de perfil de los usuarios ni la funcionalidad de administrador ya que se entiende que no son casos de uso core. Por esta razón, no se pretende que se revisen en esta entrega.

La URL de acceso a administrador es *DOMINIO DE ACCESO***/gestión-admin**, a esta URL se puede entrar solamente siendo administrador. Sin embargo, no está terminada.

Del mismo modo, algunas funcionalidades no están del todo integradas con los usuarios, por lo que pueden funcionar independientemente del rol que se tenga dando la sensación de que no se han aplicado medidas de seguridad. Sin embargo, si se han aplicado, pero algunas funcionalidades no están del todo integradas porque la funcionalidad de usuarios no es core.

# 4. DESCRIPCIÓN DE LOS CASOS DE USO PRINCIPALES(CORE)

En esta sección se explican los casos de uso que se entregan para el Sprint 1. 

# 4.1. **Búsqueda de fisioterapeuta (como anónimo)**

Historia 1:
1. Un usuario que no ha iniciado sesión entra en la página principal de la aplicación.
2. Hace click en un elemento de la pantalla que le muestra las especialidades por las que buscar.
3. Hace click para buscar por la especialidad seleccionada.
4. Aparecen en pantalla fisioterapeutas que tienen la especialidad seleccionada.

# 4.2. **Solicitud de una cita (como paciente)**

Historia 2:
1. Un usuario con rol paciente hace click en un fisioterapeuta
2. Le lleva a una pantalla que muestra los servicios disponibles(**actualmente mockup** no son los servicios reales del fisioterapeuta) y las fechas y rangos horarios disponibles para la cita.
3. El usuario puede pagar la cita(**la pasarela de pago no está todavía integrada**).
4. Al final de la reserva sale un resumen de la cita seleccionada antes de que el usuario la acepte.
5. El paciente finalmente la acepta.

Historia 
1. Si el fisioterapeuta propone un cambio, el usuario puede aceptar o cancelar el cambio en la pantalla de su calendario.
2. Si acepta el cambio, la cita estará confirmada.

# 4.3. **Gestión del calendario (como fisioterapeuta)**

Historia 
1. Un fisioterapeuta entra en la sección de sus citas
2. Puede visualizar las citas que han seleccionado los pacientes.
3. El fisioterapeuta puede aceptar la cita, cancelarla o proponer un cambio. No puede modificarla sin el consentimiento del paciente.
4. Si el paciente acepta el cambio, la cita estará confimada.

# 4.4. **Realización de una videollamada**
Actualmente esta funcionalidad no está integrada con la funcionalidad de los usuarios. Igualmente, hay muchas herramientas de la página de videollamada que no están todavía construidas, como son el modelo 3D y todas las que pertenecen a esa sección de la pantalla.

Historia :
1. Un fisioterapeuta abre la sección de videollamadas.
2. Crea una sala.
3. Al crear la sala se crea un código de sala(necesario para acceder).
4. El fisioterapeuta envía el código al paciente por un método fuera de la plataforma.
5. El fisioterapeuta puede ver al paciente y hablar con él cuando este se conecte.

Historia :
1. Un paciente abre la sección de videollamadas.
2. Se une a la sala con el código que le ha pasado el fisioterapeuta.
3. El paciente puede ver al fisioterapeuta y hablar con él cuando este se conecta.

Historia :
1. Un fisioterapeuta se conecta con un paciente a una videollamada
2. El fisioterapeuta comparte su pantalla para compartir lo que necesite de su dispositivo.
3. El paciente lo visualiza correctamente.
4. El fisioterapeuta deja de compartir pantalla y vuelve a verse su cámara.

Historia
1. Un fisioterapeuta se conecta con un paciente a una videollamada
2. El fisioterapeuta y el paciente tienen funcionalidades generales de videollamadas(silenciar audio, dejar de compartir cámara, etc.) y un chat para poder hablar.
3. Estas funcionalidades pueden activarse y desactivarse y no causan problemas con la videollamada.

# 4.3. **Aceptación de una cita (como fisioterapeuta)**






<br>

<!-- \newpage -->

<br>


# 5. DESPLIEGUE LOCAL

Por último, en este epígrade se muestran las instrucciones para la puesta en funcionamiento del proyecto en un entorno local. También se pueden consular estas instrucciones en el archivo README del proyecto: https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/README.md 


## Despliegue Local

###  Prerrequisitos

Antes de comenzar con FISIOFIND, asegúrese de que su entorno de ejecución cumpla con los siguientes requisitos:

- **Lenguaje de Programación:** Python
- **Gestor de Paquetes:** Npm, Pip
- **Base de Datos:** Postgres


###  Instalación

Instale FISIOFIND utilizando uno de los siguientes métodos:

1. Clone el repositorio de FISIOFIND:
```sh
❯ git clone https://github.com/Proyecto-ISPP/FISIOFIND
```

1. Navegue al directorio del proyecto:
```sh
❯ cd FISIOFIND
```

1. Instale las dependencias del proyecto:

**Usando `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

Primero, cree y active un entorno virtual de Python en el directorio `backend`:

```sh
❯ cd backend
❯ python -m venv venv
❯ source venv/bin/activate
```
Luego proceda a instalar las dependencias:

```sh
❯ pip install -r requirements.txt
```
**Usando `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

Ahora instalamos las dependencias del framework frontend en el directorio `frontend`:

```sh
❯ cd ../frontend
❯ npm install
```

### Configuración de la Base de Datos

Para configurar la base de datos para FISIOFIND, siga estos pasos:

1. **Crear la Base de Datos:**

  Asegúrese de tener PostgreSQL instalado y en ejecución. Luego, cree una nueva base de datos llamada `fisiofind`:

  ```sh
  ❯ psql -U postgres
  postgres=# CREATE DATABASE fisiofind;
  postgres=# \q
  ```

2. **Configurar Variables de Entorno:**

  Copie el archivo `.env.example` para crear un nuevo archivo `.env` en el directorio `backend`:

  ```sh
  ❯ cd backend
  ❯ cp .env.example .env
  ```

  Abra el archivo `.env` y actualice la configuración de la base de datos con sus credenciales de PostgreSQL:

  ```env
  DATABASE_NAME=fisiofind
  DATABASE_USER=your_postgres_user
  DATABASE_PASSWORD=your_postgres_password
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  ```

  Reemplace `your_postgres_user` y `your_postgres_password` con su nombre de usuario y contraseña de PostgreSQL.

3. **Aplicar Migraciones:**

  Con el entorno virtual activado, aplique las migraciones de la base de datos para configurar el esquema inicial:

  ```sh
  ❯ python manage.py makemigrations
  ❯ python manage.py migrate
  ```

4. **Crear un Superusuario:**

  Cree una cuenta de superusuario para acceder al panel de administración de Django:

  ```sh
  ❯ python manage.py createsuperuser
  ```

  Siga las indicaciones para configurar las credenciales del superusuario.

Una vez completados estos pasos, su base de datos debería estar configurada y lista para usar con FISIOFIND.


###  Uso

La primera vez que el proyecto se despliega localmente, necesitamos crear un archivo .env en el directorio `backend` según el archivo `.env.example`.

Para ejecutar el servidor backend, siga estos pasos en el directorio `backend` **y con el entorno virtual activado**:

```sh
❯ cd .\fisio_find
❯ python .\manage.py makemigrations
❯ python .\manage.py migrate
❯ python .\manage.py runserver
```
Adicionalmente, la primera vez que el proyecto se despliega localmente, necesitamos crear un superusuario para acceder al panel de administración:

```sh
❯ python.\manage.py createsuperuser
```

Después de que el servidor backend local esté en funcionamiento, podemos ejecutar el servidor frontend **en una nueva ventana de terminal**:

**Usando `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ cd ../../frontend
❯ npm run dev
```

### Ejecución de la Aplicación

Una vez que tanto el backend como el frontend estén corriendo, podrá acceder a la aplicación a través de la URL de la landing page (`http://localhost:3000`). Desde allí se podrá navegar entre las diferentes secciones de la aplicación, según el perfil de usuario (fisioterapeuta, paciente o administrador).

---
