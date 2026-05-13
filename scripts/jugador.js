export default class Jugador extends Phaser.Physics.Arcade.Sprite {

    constructor(escena, x, y){
        super(escena, x, y, 'jugador');
        this.escena = escena;
        this.escena.add.existing(this);
        this.escena.physics.add.existing(this);

        this.cursors = this.escena.input.keyboard.createCursorKeys();

        this.teclasWASD = this.escena.input.keyboard.addKeys({
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha: Phaser.Input.Keyboard.KeyCodes.D
        });

         // animaciones
        this.animacionAndar = {};
        this.animacionAndar.key = 'prota_camina';
        this.animacionAndar.frames = this.escena.anims.generateFrameNames('spr_player', {
             prefix: 'prota_camina',
             start: 1,
             end: 2
        });
        this.animacionAndar.frameRate = 10;
        this.animacionAndar.repeat = -1;
        this.escena.anims.create(this.animacionAndar);

        // animación de depie
        this.animacionDepie = {};
        this.animacionDepie.key = 'prota_depie';
        this.animacionDepie.frames = this.escena.anims.generateFrameNames('spr_player', {
             prefix: 'prota_depie',
             start: 1,
             end: 1
        });
        this.animacionDepie.frameRate = 10;
        this.animacionDepie.repeat = -1;
        this.escena.anims.create(this.animacionDepie);

        // animación de salto
        this.animacionSalto = {};
        this.animacionSalto.key = 'prota_salto';
        this.animacionSalto.frames = this.escena.anims.generateFrameNames('spr_player', {
             prefix: 'prota_salto',
             start: 1,
             end: 1
        });
        this.animacionSalto.frameRate = 10;
        this.animacionSalto.repeat = -1;
        this.escena.anims.create(this.animacionSalto);

    }

    update(){
        const velocidad = 200;
        const velocidadSalto = 400;

        // invertir jugador dependiendo velocidad 
        if (this.body.velocity.x > 0){
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0){
            this.setFlipX(true);
        }
        // Movimiento a la izquierda y derecha
        if (this.cursors.left.isDown || this.teclasWASD.izquierda.isDown) {
            this.setVelocityX(-velocidad);
            if (this.body.onFloor()){
                this.play('prota_camina', true);
            }
        } else if (this.cursors.right.isDown || this.teclasWASD.derecha.isDown) {
            this.setVelocityX(velocidad);
            if (this.body.onFloor()){
                this.play('prota_camina', true);
            }
        } else {
            this.setVelocityX(0);
            if (this.body.onFloor()){
                this.play('prota_depie', false);
            }
        }

        // Movimiento hacia arriba
        if (this.cursors.space.isDown && this.body.onFloor())  {
            this.setVelocityY(-velocidadSalto);
            this.play('prota_salto', false);
        }

    }
}