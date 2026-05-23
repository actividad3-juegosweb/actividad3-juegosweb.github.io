# Memoria del proyecto — [NOMBRE DEL JUEGO]

**Asignatura:** [NOMBRE ASIGNATURA]
**Curso / Grupo:** [CURSO]
**Integrantes del grupo:** [NOMBRE 1], [NOMBRE 2], [NOMBRE 3], [NOMBRE 4]
**Fecha de entrega:** [DD/MM/AAAA]
**URL del juego publicado:** [PENDIENTE — añadir cuando se publique en GitHub Pages]
**Repositorio:** [URL del repositorio]
**Vídeo de gameplay:** [opcional — URL de YouTube/Drive]

---

## 1. Introducción

[NOMBRE DEL JUEGO] es un videojuego de plataformas 2D desarrollado con la librería
**Phaser 3** (versión 3.90.0) como parte de la actividad grupal de la asignatura
[NOMBRE ASIGNATURA]. El jugador controla a **Foxy**, un pequeño zorro que debe
recorrer un nivel basado en *tilemap*, recoger gemas de distintos colores para
desbloquear los muros del mismo color, evitar enemigos y llegar a la bandera
final para superar la fase.

El proyecto se ha construido íntegramente con tecnologías web (HTML5, JavaScript
modular ES6 y CSS), lo que permite su ejecución directa en cualquier navegador
moderno sin necesidad de instalación.

### Objetivos del juego

- Recoger todas las gemas de cada color para hacer desaparecer el muro
  correspondiente.
- Esquivar o derrotar a los enemigos mediante el ataque de embestida (*roll*).
- Conservar al menos un punto de vida hasta alcanzar la bandera final.

---

## 2. Cómo jugar

| Acción           | Tecla(s)                |
|------------------|-------------------------|
| Moverse          | `A` / `D` o `←` / `→`   |
| Saltar           | `W`, `Espacio` o `↑`    |
| Atacar (roll)    | `S`                     |
| (Debug) Daño     | `H`                     |

**Mecánicas principales:**

1. **Movimiento horizontal** con aceleración instantánea (`velocidad = 180`).
2. **Salto** únicamente cuando el personaje está apoyado en el suelo
   (`onFloor()`), con velocidad inicial de `-380`.
3. **Ataque tipo *roll***: al pulsar la tecla de ataque, Foxy se impulsa hacia
   delante a `280 px/s` durante `400 ms` y activa una *hitbox* invisible que
   daña a los enemigos. Hay un *cooldown* de `500 ms` entre ataques.
4. **Sistema de vida**: el jugador empieza con 3 puntos de vida. Cada vez que
   recibe daño parpadea, queda invulnerable durante 1 segundo y recibe un
   *knockback* en sentido contrario al de la fuente del daño. Al llegar a 0
   se dispara el evento `jugador-muerto` y se muestra *GAME OVER*.
5. **Recogida de gemas y desbloqueo de muros**: cada gema recogida suma puntos
   al marcador correspondiente; al completar el total de un color, el muro
   de ese color desaparece y se sustituye en el HUD por la llave.
6. **Final del nivel**: al tocar la bandera se muestra el mensaje *YOU WIN*.

---

## 3. Elementos que componen el juego

### 3.1 Estructura de directorios

```
actividad3-juegosweb.github.io/
├── index.html              # entrada principal del juego
├── index2.html             # escena de pruebas del Personaje
├── assets/
│   ├── mapa.json           # tilemap exportado desde Tiled
│   ├── tiles.png           # tileset principal
│   ├── prota.png           # sprite antiguo (no usado en versión final)
│   ├── spr_player.png      # atlas antiguo (no usado)
│   ├── spr_player_atlas.json
│   ├── gem_*.png           # gemas (azul, verde, roja, amarilla)
│   ├── key_*.png           # llaves
│   ├── flag.png            # bandera de meta
│   ├── coin_gold.png       # icono de marcador
│   └── sunny/              # paquete gráfico Sunnyland
│       ├── Characters/Foxy/Sprites/   # frames del protagonista
│       └── environment/, Misc/         # tilesets y FX adicionales
└── scripts/
    ├── main.js             # configuración Phaser y arranque
    ├── main2.js            # arranque de la escena de prueba
    ├── escenaBase.js       # escena principal del juego
    ├── escenaBase2.js      # escena aislada para probar el Personaje
    ├── player.js           # clase Player (versión Foxy)
    ├── jugador.js          # clase Jugador (versión antigua, conservada)
    ├── gema.js             # clase Gema
    └── bandera.js          # clase Bandera
```

### 3.2 Inventario de clases

| Clase          | Fichero            | Hereda de                     | Descripción |
|----------------|--------------------|-------------------------------|-------------|
| `EscenaBase`   | `escenaBase.js`    | `Phaser.Scene`                | Escena principal del juego: carga assets, monta el tilemap, instancia jugador/gemas/bandera, gestiona colisiones y HUD. |
| `EscenaBase2`  | `escenaBase2.js`   | `Phaser.Scene`                | Escena reducida usada como banco de pruebas del Personaje. |
| `Player`       | `player.js`        | `Phaser.Physics.Arcade.Sprite`| Personaje principal (Foxy). Gestiona movimiento, salto, ataque, daño, invulnerabilidad y muerte. |
| `Jugador`      | `jugador.js`       | `Phaser.Physics.Arcade.Sprite`| Versión inicial del protagonista, mantenida por compatibilidad con la escena original. |
| `Gema`         | `gema.js`          | `Phaser.Physics.Arcade.Sprite`| Coleccionable. Tiene `tipo` (color), `valor` y `total`. |
| `Bandera`      | `bandera.js`       | `Phaser.Physics.Arcade.Sprite`| Marca el final del nivel. |

### 3.3 Inventario de assets

| Asset                                | Origen / autoría                                          | Uso |
|--------------------------------------|-----------------------------------------------------------|-----|
| `assets/sunny/Characters/Foxy/`      | **Sunnyland** (Ansimuz, licencia CC0) — pack libre        | Sprites del protagonista (idle, run, jump, hurt, Roll). |
| `assets/sunny/environment/`          | Sunnyland                                                 | Tilesets y props decorativos. |
| `assets/sunny/Misc/`                 | Sunnyland                                                 | Efectos visuales e ítems extra. |
| `assets/tiles.png`, `assets/mapa.json`| Material de la asignatura / elaboración propia con Tiled | Mapa principal del nivel. |
| `assets/gem_*.png`, `assets/key_*.png`, `assets/flag.png`, `assets/coin_gold.png` | Material de la asignatura | Coleccionables, llaves, meta y HUD. |
| `phaser.min.js` (CDN)                | Phaser Studio — licencia MIT                              | Motor del juego. |

> **Nota sobre licencias:** todos los recursos gráficos externos pertenecen al
> pack *Sunnyland* de Ansimuz, distribuido bajo licencia gratuita; Phaser se
> distribuye bajo licencia MIT. No se han incorporado recursos protegidos por
> derechos de autor.

---

## 4. Descripción del código relevante

### 4.1 Arranque y configuración (`main.js`)

Configura una instancia de `Phaser.Game` con `Phaser.AUTO` (selecciona WebGL o
Canvas automáticamente), modo de escalado `FIT` y un canvas lógico de
`1200×640`. Activa la física *Arcade* con gravedad vertical `500`. La única
escena registrada es `EscenaBase`.

```js
const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, width: 1200, height: 640, ... },
    backgroundColor: '#87CEEB',
    scene: EscenaBase,
    physics: { default: 'arcade', arcade: { gravity: { y: 500 } } }
};
new Phaser.Game(config);
```

### 4.2 Escena principal (`escenaBase.js`)

- **`preload()`**: carga las 4 gemas, las 4 llaves, la bandera, la moneda,
  el atlas del protagonista, el tileset y el `mapa.json`.
- **`create()`**:
  1. Crea el tilemap con `this.make.tilemap({ key:'map' })` y monta las capas
     `plataformas`, `muroAzul`, `muroRojo`, `muroVerde`, `muroAmarillo`.
  2. Instancia el `Jugador` y añade *colliders* contra cada capa de muro y
     contra las plataformas.
  3. Recorre las *object layers* (`gemasAzules`, `gemasVerdes`, …) y crea una
     `Gema` por cada objeto, con su *collider* contra el jugador
     (`colGemaJugador`).
  4. Instancia la `Bandera` y su *collider* (`colBanderaJugador`).
  5. Construye el HUD con marcadores de cada gema, llaves y monedas totales.
- **`colGemaJugador(gema, jugador)`**: suma puntos según el `tipo`/`valor`
  de la gema, actualiza el texto del HUD y, cuando se completan todas las
  gemas de un color, **destruye** el collider y la capa de muro
  correspondiente, sustituyendo en el HUD la gema por la llave.
- **`colBanderaJugador()`**: destruye la bandera y muestra el texto *YOU WIN*.

### 4.3 Clase `Player` (`player.js`)

Es la parte que más responsabilidad concentra y la pieza desarrollada para
esta entrega. Hereda de `Phaser.Physics.Arcade.Sprite` y se construye con
estas decisiones clave:

- **Controles agrupados en un objeto `teclas`** (`A`, `D`, `S`, `W`, `Space`)
  junto a `cursors` de flechas, para que toda la configuración de input esté
  centralizada.
- **Parámetros configurables** declarados como propiedades (`velocidad`,
  `velocidadSalto`, `velocidadRoll`, `vidaMax`, `duracionAtaque`,
  `cooldownAtaque`, `tiempoInvulnerable`) para facilitar el *balance* sin
  tocar la lógica.
- **Animaciones** creadas dinámicamente en `crearAnimaciones()` usando un
  *helper* `framesDe(prefijo, n)` que construye el array de frames a partir
  de imágenes individuales (los sprites de Foxy se distribuyen como ficheros
  PNG sueltos, no como spritesheet único). Las claves de animación
  resultantes son `player_idle`, `player_run`, `player_jump`, `player_hurt`
  y `player_roll`.
- **Ataque mediante `Phaser.GameObjects.Zone`**: se crea una zona invisible
  (`hitboxAtaque`) con cuerpo de física, desactivada por defecto. Al atacar
  se habilita durante `duracionAtaque` ms y, mientras esté activa, se
  reposiciona cada frame delante del personaje según `flipX`. Esto permite
  detectar colisiones con enemigos sin necesidad de un sprite de arma.
- **Sistema de daño con invulnerabilidad temporal**: el método
  `recibirDano(cantidad, fuenteX)` ignora el daño si el jugador ya es
  invulnerable, aplica *knockback* hacia el lado opuesto a `fuenteX`, lanza
  un `tween` de parpadeo (`alpha 1 → 0.3 → 1`) durante el periodo de
  invulnerabilidad y emite el evento `jugador-dano` con la vida restante
  para que la escena pueda actualizar el HUD.
- **Comunicación por eventos**: en lugar de acoplar `Player` con la escena,
  se emiten eventos (`jugador-ataca`, `jugador-dano`, `jugador-muerto`) a
  través de `escena.events`. La escena se suscribe a ellos y reacciona como
  considere (HUD, *game over*, contabilización de golpes, etc.).

Extracto del método de ataque:

```js
atacar() {
    this.atacando = true;
    this.puedeAtacar = false;

    const dir = this.flipX ? -1 : 1;
    this.setVelocityX(dir * this.velocidadRoll);

    this.hitboxAtaque.body.enable = true;
    this.play('player_roll', true);
    this.escena.events.emit('jugador-ataca', this.hitboxAtaque);

    this.escena.time.delayedCall(this.duracionAtaque, () => {
        this.hitboxAtaque.body.enable = false;
        this.atacando = false;
    });
    this.escena.time.delayedCall(this.cooldownAtaque, () => {
        this.puedeAtacar = true;
    });
}
```

### 4.4 Clases auxiliares (`Gema`, `Bandera`)

Son envoltorios delgados de `Phaser.Physics.Arcade.Sprite` que únicamente
desactivan la gravedad (`body.allowGravity = false`) y, en el caso de
`Gema`, guardan metadatos (`tipo`, `valor`, `total`) usados después por la
escena para puntuar y para detectar cuándo se han recogido todas las gemas
de un color.

---

## 5. Capturas de pantalla

> _Pendiente de añadir capturas reales del juego en ejecución._
>
> Capturas recomendadas:
> 1. Pantalla inicial / primer tramo del nivel con Foxy y las primeras gemas.
> 2. HUD con varias gemas recogidas y al menos una llave obtenida (muro
>    desaparecido).
> 3. Momento de ataque (animación de *roll*).
> 4. Momento de recibir daño (parpadeo).
> 5. Pantalla final con la bandera y el mensaje *YOU WIN*.

| # | Captura | Descripción |
|---|---------|-------------|
| 1 | _(añadir)_ | Inicio del nivel |
| 2 | _(añadir)_ | HUD con gemas y llaves |
| 3 | _(añadir)_ | Foxy ejecutando el roll |
| 4 | _(añadir)_ | Foxy recibiendo daño |
| 5 | _(añadir)_ | Pantalla de victoria |

---

## 6. Ejecución del juego

### Localmente

Como el proyecto utiliza módulos ES (`<script type="module">`), no es posible
abrir el `index.html` haciendo doble click; el navegador bloquearía los
imports por la política CORS de `file://`. Es necesario servirlo por HTTP:

```bash
cd actividad3-juegosweb.github.io
python3 -m http.server 8000
```

Y abrir en el navegador `http://localhost:8000/index.html`.

Alternativas equivalentes: extensión *Live Server* de VS Code,
`npx http-server`, etc.

### En la Web

[PENDIENTE — añadir URL de GitHub Pages cuando esté publicado]

---

## 7. Reparto de tareas

| Integrante     | Responsabilidad principal                                       |
|----------------|-----------------------------------------------------------------|
| [NOMBRE 1]     | Personaje principal: clase `Player`, movimiento, salto, ataque y daño. |
| [NOMBRE 2]     | [—]                                                             |
| [NOMBRE 3]     | [—]                                                             |
| [NOMBRE 4]     | [—]                                                             |

---

## 8. Conclusiones

[Aquí, en 1-2 párrafos, el grupo puede comentar las dificultades encontradas,
qué se ha aprendido del trabajo con Phaser, decisiones de diseño relevantes
(por ejemplo, el ataque como *roll* en lugar de proyectil, el sistema de
eventos para desacoplar `Player` de la escena, la elección de Sunnyland como
pack gráfico) y posibles mejoras futuras (más niveles, enemigos con IA,
sonido, menú principal…).]
