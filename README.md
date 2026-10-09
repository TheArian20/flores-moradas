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

La flor central se despliega al entrar y deforma sus pétalos con ondas desfasadas, una respiración suave y un balanceo. La animación conserva el centro y se detiene al pausar o abrir la carta.

## Editar y reconstruir

Las fuentes actuales están en `src/main.mjs`, `src/reference-scene.mjs`, `src/galaxy-particles.mjs`, `src/flower-motion.mjs` y `src/template.html`. Las cuatro texturas WebP y la tipografía están integradas en `src/reference-assets.mjs` y `src/font-asset.mjs` para permitir abrir el HTML sin conexión.

```sh
npm install
npm run build
```

El resultado es el `index.html` autónomo. Three.js se distribuye bajo MIT; véase `THREE-LICENSE.txt`. La fuente Indie Flower se distribuye bajo OFL; véase `FONT-LICENSE.txt`.

## Validación

HTML probado en Chrome con WebGL, sin conexión y con capturas en vista móvil, escritorio, lateral, entrada y carta. Sin errores JavaScript ni WebGL. Zoom y movimiento reducido comprobados. El renderizado de pruebas usa software y no representa el rendimiento de un teléfono físico. Véase `REFERENCE-NOTES.md` para la revisión temporal del video.

La rosa central se reconstruyó a partir de un fotograma del video con la herramienta integrada de generación de imágenes. Véase `ASSET-PROMPT.md`. Las ilustraciones son reconstrucciones visuales, no los recursos originales del sitio mostrado en el video.
