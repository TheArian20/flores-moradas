# Flores moradas para ti 💜 — versión 3D

Galaxia interactiva en Three.js/WebGL basada en el video de referencia: entrada con flor de partículas blancas, expansión al abrir, rosa violeta central, rosas pequeñas, margaritas, flores de cinco pétalos, polvo luminoso, frases y anillos de texto. Las flores usan texturas dentro de una escena con cámara orbital; la rosa principal está sobre una superficie curva.

## Abrir

Descarga `index.html` y ábrelo en Chrome, Edge o Firefox con WebGL y aceleración gráfica. El motor y los recursos están integrados: no necesita internet ni instalación para visualizarlo.

## Controles

- Arrastra para girar en 3D.
- Rueda o pellizco para zoom.
- Doble clic o R para reiniciar.
- Flechas para girar, más/menos para zoom y espacio para pausar.
- El sobre abre la dedicatoria.

La animación comienza pausada cuando el sistema solicita movimiento reducido.

## Editar y reconstruir

Las fuentes actuales están en `src/main.mjs`, `src/reference-scene.mjs`, `src/reference-assets.mjs` y `src/template.html`. Las cuatro texturas WebP están integradas en el módulo para permitir abrir el HTML sin conexión.

```sh
npm install
npm run build
```

El resultado es el `index.html` autónomo. Three.js se distribuye bajo MIT; véase `THREE-LICENSE.txt`.

## Validación

Motor empaquetado, sintaxis validada y geometría comprobada. Se renderizaron vistas vertical, horizontal, lateral y de entrada con OpenGL a partir de la escena. Falta verificar la interacción y el postprocesado en un navegador real. Véase `REFERENCE-NOTES.md` para la revisión temporal del video y los límites de la reproducción.

Las ilustraciones florales se crearon con la herramienta integrada de generación de imágenes en iteraciones previas. Son aproximaciones visuales, no los recursos originales del sitio mostrado en el video.
