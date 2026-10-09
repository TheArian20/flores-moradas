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

La entrada muestra una rosa translúcida con 6.500 partículas tomadas de sus pétalos reales, título en dos líneas y botón de acabado suave. Al entrar, la rosa se desvanece y las partículas se dispersan. La escena Three.js conserva la rosa central sobre superficie curva animada, 180 flores pequeñas y 46 frases. Las tres frases próximas a la rosa recorren órbitas mientras mantienen su orientación hacia la cámara; se quitaron los aros visibles y las cintas que deformaban o invertían las palabras. La galaxia usa 10.000 partículas en brazos espirales, 4.200 en el núcleo, 420 destellos y 1.800 partículas suaves de profundidad. Se añadieron pequeños cristales facetados y la tipografía manuscrita Indie Flower incrustada. Las interacciones de cámara del video se reproducen mediante arrastre y zoom del usuario.

Los textos de la carta y los botones se conservaron. La rosa se regeneró tomando el fotograma 7 como referencia: pétalos anchos y redondeados con bordes azulados. El recurso y el prompt se documentan en `ASSET-PROMPT.md`. Las ilustraciones son reconstrucciones, no los recursos originales del sitio grabado. La barra del navegador, la hora, la batería y el cursor de la grabación no forman parte de la página.

## Comprobación

HTML probado en Chrome headless con renderizado WebGL y red desconectada. Capturas de la entrada, galaxia vertical (482 × 860), escritorio (1440 × 900), vista lateral y carta. Sin errores JavaScript ni WebGL. Zoom comprobado mediante cambio del canvas. Movimiento reducido comprobado mediante igualdad de dos capturas separadas. La prueba usa renderizado de software aislado y no mide el rendimiento de un teléfono físico.

Capturas locales: `video-analysis/october/browser/`. Prueba reproducible desde `galaxia-morada`: `node browser-check.cjs`, usando las dependencias locales de `.render-tools/browser` y Chrome instalado.

## Animación de entrada

La rosa se despliega al cargar, gira continuamente, balancea su volumen y ondula los pétalos. La textura y las partículas comparten la deformación en GPU. Se añadieron 44 puntos luminosos en movimiento y destellos sobre los pétalos. La pausa y la preferencia de movimiento reducido se conservan.

`node check-intro-motion.cjs` comprueba movimiento dentro del recorte de la flor, pausa, entrada a la galaxia y movimiento reducido. La ejecución cambió el 45,5 % de los píxeles del recorte entre dos instantes, sin errores de JavaScript ni de WebGL. Grabación real del canvas: `video-analysis/october/browser/intro-motion.webm`.
