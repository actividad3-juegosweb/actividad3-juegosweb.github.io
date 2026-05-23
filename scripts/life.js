export default class Corazon extends Phaser.Physics.Arcade.Sprite {

    constructor(escena, x, y) {
        
        super(escena, x, y, 'corazonLleno');
        escena.add.existing(this);
        escena.physics.add.existing(this);
        this.body.allowGravity = false;
        this.body.setImmovable(true);
    }
}