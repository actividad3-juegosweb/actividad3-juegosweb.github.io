import Player from './player.js';

export default class EscenaBase2 extends Phaser.Scene {

    preload(){
       
        //mapa y tiles
        this.load.image('tilesheet', 'assets/tiles.png');
        this.load.tilemapTiledJSON('map', 'assets/mapa.json');

        // Sprites
        const baseFoxy = 'assets/sunny/Characters/Foxy/Sprites';
        for (let i = 1; i <= 4; i++) this.load.image(`player-idle-${i}`, `${baseFoxy}/idle/player-idle-${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`player-run-${i}`,  `${baseFoxy}/run/player-run-${i}.png`);
        for (let i = 1; i <= 2; i++) this.load.image(`player-jump-${i}`, `${baseFoxy}/jump/player-jump-${i}.png`);
        for (let i = 1; i <= 2; i++) this.load.image(`player-hurt-${i}`, `${baseFoxy}/hurt/player-hurt-${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`Roll${i}`,         `${baseFoxy}/Roll/Roll${i}.png`);
    }

    create() {
        this.mapa = this.make.tilemap({ key: 'map' });
        this.hojaTiles = this.mapa.addTilesetImage('tiles', 'tilesheet', 64, 64, 0, 0);
        this.plataformas = this.mapa.createLayer('plataformas', this.hojaTiles, 0, 0);
        this.plataformas.setCollisionByExclusion(-1, true);

        this.player = new Player(this, 200, 400);
        this.physics.add.collider(this.player, this.plataformas);

        // Cámara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);

        // HUD de vida (texto simple para probar)
        this.txtVida = this.add.text(20, 20, `Vida: ${this.player.vida}`, {
            fontSize: '28px', fontStyle: 'bold', color: '#fff'
        }).setScrollFactor(0);

        this.events.on('jugador-dano', vida => {
            this.txtVida.setText(`Vida: ${vida}`);
        });

        this.events.on('jugador-muerto', () => {
            this.add.text(400, 250, 'GAME OVER', {
                fontSize: '80px', fontStyle: 'bold', color: '#f33'
            }).setScrollFactor(0);
        });

        // Botón de prueba: pulsa H para simular recibir daño
        this.input.keyboard.on('keydown-H', () => {
            this.player.recibirDano(1, this.player.x + 50);
        });

        // Instrucciones en pantalla
        this.add.text(20, 60,
            'A/D o ←/→ mover | W/SPACE/↑ saltar | S atacar (roll) | H simular daño',
            { fontSize: '18px', color: '#fff', backgroundColor: '#0006', padding: { x: 6, y: 4 } }
        ).setScrollFactor(0);
    }

    update(){
        this.player.update();
    }
}
