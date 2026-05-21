export default class Gema extends Phaser.Physics.Arcade.Sprite {

    constructor(escena,x,y, tipoGema, tipo, total){
        super(escena, x, y, tipoGema);
        this.tipo = tipo;
        this.total = total;
        switch (tipo) {
            case 1:
                this.valor = 1;
                break;
            case 2:
                this.valor = 2;
                break;
            case 3:
                this.valor = 5;
                break;
            case 4:
                this.valor = 10;
                break;
            default:
                this.valor = 0;
            // Código si ningún caso coincide
        }

        this.escena = escena;
        this.escena.add.existing(this);

        // si es fisico añadir al mundo fisico
        this.escena.physics.add.existing(this);

        // desactivamos la gravedad para el objeto
        this.body.allowGravity = false;
    }

    update(){

    }
}