# Flores moradas para ti 💜

Galaxia interactiva de flores moradas con una entrada de partículas, flores y frases flotantes, y una dedicatoria.

## Abrir

Descarga `index.html` y ábrelo en un navegador moderno. El archivo incluye HTML, CSS, JavaScript e imágenes: no requiere instalación ni conexión a internet.

## Controles

- Pulsa **Abrir mi galaxia 💜** para entrar.
- Arrastra con el ratón o un dedo para girar.
- Usa la rueda o un pellizco con dos dedos para acercar y alejar.
- Haz doble clic para restablecer la vista.
- Pulsa el sobre para abrir la dedicatoria.
- Con la escena enfocada, usa las flechas para girar, más/menos para zoom y espacio para pausar o reanudar.

Si tu sistema tiene activada la preferencia de movimiento reducido, la animación comienza pausada.

## Recursos

Las flores se generaron con ImageGen y están integradas en el HTML. La composición se inspira en el video de referencia proporcionado por el autor del proyecto.

## Revisión visual

La flor central usa una imagen generada a partir de la referencia y mapeada sobre una superficie curva de 392 triángulos con orden de profundidad. Incluye perspectiva, giro por debajo del disco, apertura progresiva y controles de zoom limitados. Las flores secundarias responden a la inclinación de la cámara.

Se comprobaron renders Canvas reales de la entrada, vista frontal, de canto y cenital. Se probaron carga de imágenes, apertura y cierre de la carta, zoom máximo/mínimo, reinicio y pausa. Estas comprobaciones no sustituyen una prueba de interacción en un navegador real.
