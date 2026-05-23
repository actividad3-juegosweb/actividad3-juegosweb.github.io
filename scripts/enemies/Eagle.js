export default class Eagle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'atlas-enemigos', 'eagle/eagle-attack-1');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setScale(1); // Escala adaptada
        
        this.body.setAllowGravity(false); // Vuela, ignora la gravedad global
        this.body.setSize(16, 13).setOffset(8, 16);
        
        this.play('eagle_attack');
        this.enemyType = 'eagle';
        this.scene = scene;

        // Movimiento vertical constante usando el sistema de Tweens de Phaser 3
        this.scene.tweens.add({
            targets: this,
            y: y + 120,
            duration: 1500,
            ease: 'Linear',
            yoyo: true,
            loop: -1
        });
    }

    update() {
        if (!this.active || !this.scene.player) return;

        // El águila siempre vigila horizontalmente la posición del jugador
        this.flipX = this.x <= this.scene.player.x;
    }
}