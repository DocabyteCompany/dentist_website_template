# Fuentes Web para el Template Dental

Este template utiliza por defecto las siguientes fuentes:
- Montserrat (para headings)
- Roboto (para texto de cuerpo)

## Opción 1: Google Fonts (recomendado)
1. Abre el archivo `index.html`.
2. Agrega dentro de la etiqueta <head> lo siguiente:

<link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">

3. Asegúrate de que en tu CSS las variables sean:

:root {
  --font-family-heading: 'Montserrat', sans-serif;
  --font-family-body: 'Roboto', sans-serif;
}

## Opción 2: Fuentes Locales
1. Descarga los archivos `.woff` o `.ttf` de Montserrat y Roboto.
2. Colócalos en esta carpeta (`assets/fonts/`).
3. En tu CSS principal, agrega:

@font-face {
  font-family: 'Montserrat';
  src: url('../fonts/Montserrat-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Roboto';
  src: url('../fonts/Roboto-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

Y así sucesivamente para los pesos que necesites.

Luego, asegúrate de que las variables CSS apunten a estas fuentes.

---

Puedes cambiar las fuentes globalmente editando las variables en `assets/css/style.css`. 