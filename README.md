# 📍 Mapa FAHU -- React

Aplicación web desarrollada en **React** que permite visualizar un mapa
interactivo de la Facultad de Humanidades (FAHU) y del campus de la
**Universidad de Santiago de Chile (USACH)**.\
Su objetivo es facilitar la orientación de estudiantes, docentes y
visitantes mediante un mapa intuitivo, accesible y con accesos directos
a servicios institucionales.

## 🚀 Tecnologías principales

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&style=flat)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&style=flat)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Características principales

-   🗺️ **Mapa interactivo del campus USACH** usando **Leaflet** y
    **React Leaflet**.\
-   🎯 **Búsqueda y navegación rápida** dentro de la FAHU (edificios,
    salas, oficinas, bibliotecas, casinos).\
-   🔗 **Accesos directos** a portales institucionales como Biblioteca
    USACH, Usach Atiende, matrícula, entre otros.\
-   📱 **Diseño responsive** y adaptado para dispositivos móviles.\
-   🧭 **Interfaz intuitiva** para estudiantes nuevos y visitantes.\
-   ⚙️ **Sección de configuración** para personalizar la visualización
    del mapa.

## 🖼️ Capturas de pantalla

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Vista principal                       Menú                                    Servicios                                    Configuración
  ------------------------------------- --------------------------------------- -------------------------------------------- -----------------------------------------
  ![mapa                                ![menu                                  ![servicios                                  ![config
  screen](screenshots/main_maps.jpeg)   screen](screenshots/menu_screen.jpeg)   screen](screenshots/servicios_screen.jpeg)   screen](screenshots/config_screen.jpeg)

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 🧩 Arquitectura del proyecto

    /src
     ├── components      # Componentes UI y funcionales
     ├── screens         # Vistas principales (Mapa, Servicios, Configuración)
     ├── assets          # Imágenes, íconos, logos
     ├── data            # Datos estáticos, rutas, puntos del mapa
     ├── hooks           # Hooks personalizados
     ├── styles          # Estilos (Tailwind, CSS adicional)
     └── App.jsx         # App principal

## 📦 Requisitos

-   Node.js \>= 18\
-   npm \>= 9\
-   Navegador moderno\
-   Mobile Android/iOS

## 📚 Dependencias principales

    {
      "react": "^19.1.1",
      "react-dom": "^19.1.1",
      "react-scripts": "5.0.1",
      "leaflet": "^1.9.4",
      "react-leaflet": "^5.0.0",
      "tailwindcss": "^3.x",
      "autoprefixer": "^10.x"
    }

## 🤝 Contribuciones

Las contribuciones son bienvenidas.\
Puedes abrir un Issue o enviar un Pull Request.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
