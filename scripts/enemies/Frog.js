export default class Frog extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'atlas-enemigos', 'frog/idle/frog-idle-1');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setScale(1);
        
        this.body.setGravityY(600);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(16, 16).setOffset(8, 11);
        
        this.play('frog_idle');
        this.enemyType = 'frog';
        this.side = 'right'; // Dirección del próximo salto lógico
        this.scene = scene;
    }

    update() {
        if (!this.active || !this.body) return;

        // Detecta si la escena global ordenó cambiar de dirección para efectuar el salto
        if (this.side === 'left' && this.scene.frogJumpSide === 'right') {
            this.flipX = false;
            this.side = 'right';
            this.body.setVelocityY(-370); // Fuerza de salto vertical
            this.body.setVelocityX(-90); // Impulso horizontal
        } else if (this.side === 'right' && this.scene.frogJumpSide === 'left') {
            this.flipX = true;
            this.side = 'left';
            this.body.setVelocityY(-370);
            this.body.setVelocityX(90);
        } else if (this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setVelocityX(0); // Al tocar suelo se detiene en seco
        }

        // Intercambio dinámico de texturas dependiendo de si se encuentra en el aire
        if (this.body.velocity.y < 0) {
            this.setFrame('frog/jump/frog-jump-1'); // Frame subiendo
        } else if (this.body.velocity.y > 0) {
            this.setFrame('frog/jump/frog-jump-2'); // Frame cayendo
        } else {
            // De vuelta en el suelo, regresa a su animación idle
            if (this.anims.currentAnim && this.anims.currentAnim.key !== 'frog_idle') {
                this.play('frog_idle');
            }
        }
    }
}