export default class Opossum extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Inicializa usando el atlas-enemigos y el primer frame del opossum
        super(scene, x, y, 'atlas-enemigos', 'opossum/opossum-1');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setScale(1); // Escala adaptada al tamaño de tu Player
        
        this.body.setGravityY(600);
        this.body.setBounce(1, 0); // Rebota horizontalmente al chocar con un muro o fin de plataforma
        this.body.setCollideWorldBounds(true);
        
        // Caja de colisión ajustada al sprite escalado
        this.body.setSize(16, 13).setOffset(8, 15);

        // Velocidad inicial aleatoria (izquierda o derecha)
        this.body.setVelocityX(100 * Phaser.Math.RND.pick([1, -1]));
        
        this.play('opossum_run');
        this.enemyType = 'opossum';
    }

    update() {
        if (!this.active || !this.body) return;
        
        // Voltea el sprite dependiendo de hacia dónde se mueva físicamente
        this.flipX = this.body.velocity.x > 0;
    }
}