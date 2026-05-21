import Player from './player.js';
import Opossum from './enemies/Opossum.js';
import Eagle from './enemies/Eagle.js';
import Frog from './enemies/Frog.js';

export default class EscenaBase2 extends Phaser.Scene {

    preload(){
        // Mapa y tiles
        this.load.image('tilesheet', 'assets/tiles.png');
        this.load.tilemapTiledJSON('map', 'assets/mapa.json');

        // Sprites del Jugador
        const baseFoxy = 'assets/sunny/Characters/Foxy/Sprites';
        for (let i = 1; i <= 4; i++) this.load.image(`player-idle-${i}`, `${baseFoxy}/idle/player-idle-${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`player-run-${i}`,  `${baseFoxy}/run/player-run-${i}.png`);
        for (let i = 1; i <= 2; i++) this.load.image(`player-jump-${i}`, `${baseFoxy}/jump/player-jump-${i}.png`);
        for (let i = 1; i <= 2; i++) this.load.image(`player-hurt-${i}`, `${baseFoxy}/hurt/player-hurt-${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`Roll${i}`,         `${baseFoxy}/Roll/Roll${i}.png`);

        // Cargar el Atlas para enemigos y efectos de explosión
        this.load.atlas('atlas-enemigos', 'assets/atlas.png', 'assets/atlas.json');
    }

    create() {
        // Variable que las ranas consultan para saber cuándo y hacia dónde saltar
        this.frogJumpSide = 'left';

        this.mapa = this.make.tilemap({ key: 'map' });
        this.hojaTiles = this.mapa.addTilesetImage('tiles', 'tilesheet', 64, 64, 0, 0);
        this.plataformas = this.mapa.createLayer('plataformas', this.hojaTiles, 0, 0);
        this.plataformas.setCollisionByExclusion(-1, true);

        this.player = new Player(this, 200, 400);
        this.physics.add.collider(this.player, this.plataformas);

        // Generar animaciones de los enemigos desde el Atlas
        this.crearAnimacionesEnemigos();

        // Crear el grupo dinámico de enemigos configurando la actualización automática de hijos
        this.enemies = this.physics.add.group({ runChildUpdate: true });
        
        this.physics.add.collider(this.enemies, this.plataformas);
        
        // Solución de colisiones jugador vs enemigos (Combate)
        this.physics.add.overlap(this.player, this.enemies, this.checkAgainstEnemies, null, this);

        // Temporizador cíclico: cambia la dirección de salto de las ranas cada 2 segundos
        this.time.addEvent({
            delay: 2000,
            callback: () => { this.frogJumpSide = (this.frogJumpSide === 'left') ? 'right' : 'left'; },
            loop: true
        });

        // === SPAWN DE ENEMIGOS DE PRUEBA ===
        // Recuerda modificar estas coordenadas para que coincidan con las plataformas de tu mapa.json
        this.enemies.add(new Opossum(this, 500, 300));
        this.enemies.add(new Frog(this, 800, 300));
        this.enemies.add(new Eagle(this, 650, 200));

        // Cámara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);

        // HUD de vida
        this.txtVida = this.add.text(20, 20, `Vida: ${this.player.vida}`, {
            fontSize: '28px', fontStyle: 'bold', color: '#fff'
        }).setScrollFactor(0);

        this.events.on('jugador-dano', vida => {
            this.txtVida.setText(`Vida: ${vida}`);
        });

        this.events.on('jugador-muerto', () => {
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'GAME OVER', {
                fontSize: '80px', fontStyle: 'bold', color: '#f33'
            }).setOrigin(0.5).setScrollFactor(0);
        });

        // Botón de prueba: pulsa H para simular recibir daño
        this.input.keyboard.on('keydown-H', () => {
            this.player.recibirDano(1, this.player.x + 50);
        });
    }

    update(){
        this.player.update();
        // Nota: ya no es necesario iterar manualmente sobre los enemigos aquí
        // gracias a que definimos 'runChildUpdate: true' en la creación del grupo.
    }

    crearAnimacionesEnemigos() {
        if (this.anims.exists('opossum_run')) return;

        this.anims.create({
            key: 'opossum_run',
            frames: this.anims.generateFrameNames('atlas-enemigos', { prefix: 'opossum/opossum-', start: 1, end: 6 }),
            frameRate: 12, repeat: -1
        });

        this.anims.create({
            key: 'eagle_attack',
            frames: this.anims.generateFrameNames('atlas-enemigos', { prefix: 'eagle/eagle-attack-', start: 1, end: 4 }),
            frameRate: 12, repeat: -1
        });

        this.anims.create({
            key: 'frog_idle',
            frames: this.anims.generateFrameNames('atlas-enemigos', { prefix: 'frog/idle/frog-idle-', start: 1, end: 4 }),
            frameRate: 6, repeat: -1
        });

        this.anims.create({
            key: 'enemy_dead',
            frames: this.anims.generateFrameNames('atlas-enemigos', { prefix: 'enemy-death/enemy-death-', start: 1, end: 6 }),
            frameRate: 16
        });
    }

    checkAgainstEnemies(player, enemy) {
        // Validación 1: El jugador está cayendo directamente sobre el enemigo (aplastar)
        const atacandoDesdeArriba = (player.y + player.body.height * 0.5 < enemy.y + 15) && player.body.velocity.y > 0;
        
        // Validación 2: El jugador está usando su ataque rodante ('player_roll') definido en tu player.js
        const atacandoConRoll = player.atacando === true;

        if (atacandoDesdeArriba || atacandoConRoll) {
            // Efecto de explosión/humo al morir el enemigo
            let death = this.add.sprite(enemy.x, enemy.y, 'atlas-enemigos', 'enemy-death/enemy-death-1').setOrigin(0.5, 0.5);
            death.setScale(3);
            death.play('enemy_dead');
            death.on('animationcomplete', () => death.destroy());

            // Destruye el objeto del enemigo (lo remueve de las físicas y de la escena)
            enemy.destroy();
            
            // Si lo derrotó cayendo encima, darle un pequeño impulso vertical de rebote
            if (atacandoDesdeArriba) {
                player.setVelocityY(-300);
            }
        } else {
            // Si el contacto es normal, el enemigo hiere al jugador pasándole su posición X para el retroceso
            player.recibirDano(1, enemy.x);
        }
    }
}