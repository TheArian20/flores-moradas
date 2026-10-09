# Flores moradas para ti 💜 — versión 3D

Galaxia interactiva en Three.js/WebGL. Rosas y margaritas con geometría, iluminación, brillo y cámara orbital. La entrada muestra una rosa de 24.000 partículas tomadas de la superficie real de sus pétalos.

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

Las fuentes están en `src/main.mjs`, `src/rose.mjs` y `src/template.html`.

```sh
npm install
npm run build
```

El resultado es el `index.html` autónomo. Three.js se distribuye bajo MIT; véase `THREE-LICENSE.txt`.

## Validación

Mallas y normales verificadas, muestreo de 24.000 partículas comprobado, motor empaquetado y sintaxis del HTML validada. La geometría se renderizó desde arriba y de lado con OpenGL. La interacción y el acabado final en un navegador real requieren comprobación; esos renders no reproducen el postprocesado de Three.js.
