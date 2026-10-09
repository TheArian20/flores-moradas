# Referencia del 9 de octubre

Video local: WhatsApp Video 2026-10-09 at 11.19.20.mp4. Duración 25,1 segundos, 753 fotogramas a 30 fps. Se decodificaron todos los fotogramas y se exportaron 51 vistas a intervalos de medio segundo para revisión visual.

## Secuencia observada

- 0–1,5 s: flor de puntos con pétalos redondeados superpuestos, centro blanco y botón degradado «Abrir mi galaxia 💜»; sobre violeta abajo a la derecha.
- 1,5–3,5 s: expansión/dispersión de partículas y aparición gradual del título y la galaxia.
- 3,5–6 s: rosa central violeta, pequeñas rosas, margaritas con centros amarillos, flores de cinco pétalos, polvo luminoso y frases.
- 6–10 s: cámara inclinada hasta dejar el disco casi horizontal. Las flores pequeñas conservan su orientación hacia el espectador.
- 10–14,5 s: acercamiento a la rosa, frases y anillos de texto atraviesan distintas profundidades.
- 14,5–17 s: alejamiento con vista superior.
- 17–22,5 s: vista lateral, desplazamientos y zoom.
- 23–24 s: carta sobre fondo oscurecido y desenfocado, con título, cierre y dos párrafos.

## Implementación

Escena Three.js con flor de entrada de 12.700 puntos, rosa central sobre superficie curva animada, 180 flores pequeñas, 46 frases y tres cintas de texto continuas sobre órbitas inclinadas. La galaxia usa 10.000 partículas en brazos espirales, 4.200 en el núcleo, 420 destellos y 1.800 partículas suaves de profundidad. Se añadieron pequeños cristales facetados y la tipografía manuscrita Indie Flower incrustada. Las interacciones de cámara del video se reproducen mediante arrastre y zoom del usuario; no se fuerzan los gestos de la grabación.

Los textos de la carta y los botones se conservaron. La rosa se regeneró tomando el fotograma 7 como referencia: pétalos anchos y redondeados con bordes azulados. El recurso y el prompt se documentan en `ASSET-PROMPT.md`. Las ilustraciones son reconstrucciones, no los recursos originales del sitio grabado. La barra del navegador, la hora, la batería y el cursor de la grabación no forman parte de la página.

## Comprobación

HTML probado en Chrome headless con renderizado WebGL y red desconectada. Capturas de la entrada, galaxia vertical (482 × 860), escritorio (1440 × 900), vista lateral y carta. Sin errores JavaScript ni WebGL. Zoom comprobado mediante cambio del canvas. Movimiento reducido comprobado mediante igualdad de dos capturas separadas. La prueba usa renderizado de software aislado y no mide el rendimiento de un teléfono físico.

Capturas locales: `video-analysis/october/browser/`. Prueba reproducible desde `galaxia-morada`: `node browser-check.cjs`, usando las dependencias locales de `.render-tools/browser` y Chrome instalado.
