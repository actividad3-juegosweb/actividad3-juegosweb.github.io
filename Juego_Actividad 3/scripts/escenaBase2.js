import Player from './player.js';
import Opossum from './enemies/Opossum.js';
import Eagle from './enemies/Eagle.js';
import Frog from './enemies/Frog.js';

export default class EscenaBase extends Phaser.Scene {

    preload(){
        
        // CARGAR MAPA Y TILESET //
        this.load.image('tilesheet','assets/tileset.png');
        this.load.tilemapTiledJSON('map','assets/map.json');

        // CARGAR ANIMACIONES PLAYER //
        const baseFoxy = 'assets/sunny/Characters/Foxy/Sprites';

        for (let i = 1; i <= 4; i++)
            this.load.image(`player-idle-${i}`, `${baseFoxy}/idle/player-idle-${i}.png`);

        for (let i = 1; i <= 6; i++)
            this.load.image(`player-run-${i}`,  `${baseFoxy}/run/player-run-${i}.png`);

        for (let i = 1; i <= 2; i++)
            this.load.image(`player-jump-${i}`, `${baseFoxy}/jump/player-jump-${i}.png`);

        for (let i = 1; i <= 2; i++)
            this.load.image(`player-hurt-${i}`, `${baseFoxy}/hurt/player-hurt-${i}.png`);

        for (let i = 1; i <= 4; i++)
            this.load.image(`Roll${i}`, `${baseFoxy}/Roll/Roll${i}.png`);

        // CARGAR ATLAS ENEMIGOS Y EXPLOSION DE MUERTE //
        this.load.atlas('atlas-enemigos', 'assets/atlas.png', 'assets/atlas.json');
        //CARGAR MUSICA //
        this.load.audio('musica-fondo', 'assets/audio/musica.mp3');
        this.load.audio('enemy-dead-sound', 'assets/audio/sonido-explosion.mp3');
        this.load.audio('hurt-sound', 'assets/audio/sonido-dano.mp3');
    }

    create(){

        // VARIABLE RANA PARA SABER CUANDO Y DONDE SALTAR //
        this.frogJumpSide = 'left';

        // CREAR MAPA Y TILES //
        this.mapa = this.make.tilemap({key:'map'});
        this.hojaTiles = this.mapa.addTilesetImage('tileset','tilesheet',16,16,0,0);
    
        //CREAR MUSICA //
        this.musica = this.sound.add('musica-fondo', {
        volume: 0.3,
        loop: true
        });
        this.musica.play();

        // CREAR CAPAS //
        this.backgroundFixed = this.mapa.createLayer('background_fixed', this.hojaTiles, 0, 0);
        this.background = this.mapa.createLayer('background', this.hojaTiles, 0, 0);
        this.solid = this.mapa.createLayer('solid', this.hojaTiles, 0, 0);
        this.platforms = this.mapa.createLayer('platforms', this.hojaTiles, 0, 0);
        this.foreground = this.mapa.createLayer('foreground', this.hojaTiles, 0, 0);

        // COLISIONES TILEMAP //
        this.solid.setCollisionByExclusion(-1, true);

        // PLATAFORMAS SOLO COLISIONAN DESDE ARRIBA //
        this.platforms.setCollisionByExclusion(-1, true);

        // CREAR PLAYER //
        this.player = new Player(this,50, 0);

        // COLISION PLAYER CON SUELO //
        this.physics.add.collider(this.player, this.solid);

        // PLATAFORMAS ATRAVESABLES POR ABAJO //
        this.physics.add.collider(
            this.player,
            this.platforms,
            null,
            (player, tile) => {

                return player.body.velocity.y >= 0;
            },
            this
        );

        // GENERACION DE ANIMACIONES DE ENEMIGOS (ATLAS) //
        this.crearAnimacionesEnemigos();

        // CREAR GRUPO ENEMIGOS //
        this.enemies = this.add.group();

        // COLISION ENEMIGOS CON SUELO //
        this.physics.add.collider(this.enemies, this.solid);

        // PLATAFORMAS ATRAVESABLES POR ABAJO ENEMIGOS //
        this.physics.add.collider(
            this.enemies,
            this.platforms,
            null,
            (enemy, tile) => {

                return enemy.body.velocity.y >= 0;
            },
            this
        );
        
        // COLISION JUGADOR VS ENEMIGOS //
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.checkAgainstEnemies,
            null,
            this
        );

        // TEMPORIZADOR CAMBIO DIRECCION RANAS //
        this.time.addEvent({
            delay: 2000,
            callback: () => {

                this.frogJumpSide =
                    (this.frogJumpSide === 'left')
                    ? 'right'
                    : 'left';
            },
            loop: true
        });

        // === SPAWN ZONA 1 ENEMIGOS === //
        this.enemies.add(new Opossum(this, 250, 300));
        this.enemies.add(new Opossum(this, 400, 300));

        this.enemies.add(new Frog(this, 700, 0));
        this.enemies.add(new Frog(this, 300, 0));
        this.enemies.add(new Frog(this, 500, 0));

        this.enemies.add(new Eagle(this, 650, 200));
        this.enemies.add(new Eagle(this, 800, 200));

        // === SPAWN ZONA 2 ENEMIGOS === //
        this.enemies.add(new Frog(this, 200, 400));
        this.enemies.add(new Eagle(this, 290, 775));
        this.enemies.add(new Eagle(this, 140, 630));
        this.enemies.add(new Eagle(this, 205, 700));
        this.enemies.add(new Eagle(this, 390, 450));
        this.enemies.add(new Opossum(this, 250, 590));
        this.enemies.add(new Opossum(this, 300, 890));
        this.enemies.add(new Opossum(this, 500, 890));
        // CONFIGURAR CAMARA //
        this.cameras.main.startFollow(this.player);

        this.cameras.main.setZoom(2.5);

        this.cameras.main.setBounds(
            0,
            0,
            this.mapa.widthInPixels,
            this.mapa.heightInPixels
        );

        // EVENTO MUERTE JUGADOR //
        this.events.on('jugador-muerto', () => {

            this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'GAME OVER',
                {
                    fontSize: '80px',
                    fontStyle: 'bold',
                    color: '#f33'
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0);
        });
    }

    update(){

        this.player.update();

        this.enemies.children.iterate(enemy => {

            if (enemy && enemy.update) {
                enemy.update();
            }
        });
    }
    
    crearAnimacionesEnemigos() {

        if (this.anims.exists('opossum_run')) return;

        this.anims.create({
            key: 'opossum_run',
            frames: this.anims.generateFrameNames('atlas-enemigos', {
                prefix: 'opossum/opossum-',
                start: 1,
                end: 6
            }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'eagle_attack',
            frames: this.anims.generateFrameNames('atlas-enemigos', {
                prefix: 'eagle/eagle-attack-',
                start: 1,
                end: 4
            }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'frog_idle',
            frames: this.anims.generateFrameNames('atlas-enemigos', {
                prefix: 'frog/idle/frog-idle-',
                start: 1,
                end: 4
            }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'frog_jump',
            frames: this.anims.generateFrameNames('atlas-enemigos', {
                prefix: 'frog/jump/frog-jump-',
                start: 1,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_dead',
            frames: this.anims.generateFrameNames('atlas-enemigos', {
                prefix: 'enemy-death/enemy-death-',
                start: 1,
                end: 6
            }),
            frameRate: 16
        });
    }

    checkAgainstEnemies(player, enemy) {

        // VALIDACION JUGADOR CAYENDO SOBRE ENEMIGO //
        const atacandoDesdeArriba =
            (player.y + player.body.height * 0.5 < enemy.y + 15)
            &&
            player.body.velocity.y > 0;
        
        // VALIDACION ATAQUE ROLL //
        const atacandoConRoll = player.atacando === true;

        if (atacandoDesdeArriba || atacandoConRoll) {

            // EFECTO MUERTE ENEMIGO //
            let death = this.add.sprite(
                enemy.x,
                enemy.y,
                'atlas-enemigos',
                'enemy-death/enemy-death-1'
            ).setOrigin(0.5, 0.5);

            death.setScale(3);

            death.play('enemy_dead');

            death.on('animationcomplete', () => death.destroy());

            // SONIDO MUERTE ENEMIGO //
            this.sound.play('enemy-dead-sound', {
                volume: 0.2
            });


            // DESTRUIR ENEMIGO //
            enemy.destroy();
            
            // REBOTE JUGADOR //
            if (atacandoDesdeArriba) {
                player.setVelocityY(-300);
            }

        } else {

            // DAÑO AL JUGADOR //
            player.recibirDano(1, enemy.x);
            
            // SONIDO MUERTE ENEMIGO //
            this.sound.play('hurt-sound', {
                volume: 0.2
            });

        }
    }
}