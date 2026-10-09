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

Escena Three.js con flor de entrada de 12.700 puntos, rosa central sobre superficie curva, 155 flores pequeñas orientadas hacia la cámara, 18.000 partículas, 140 destellos, 48 frases y tres órbitas con letras. Las interacciones de cámara del video se reproducen mediante arrastre y zoom del usuario; no se fuerzan los gestos de la grabación.

Los textos de la carta y los botones se conservaron. Las ilustraciones florales son recursos generados previamente, no los originales del sitio grabado. La barra del navegador, la hora, la batería y el cursor de la grabación no forman parte de la página.

## Comprobación

Sintaxis y empaquetado del HTML; posiciones finitas de la geometría; exportación de cuatro vistas OpenGL desde la misma escena: vertical, horizontal, lateral e inicio. Estas vistas verifican composición y geometría, pero no sustituyen una prueba de interacción o del postprocesado en un navegador real.
