import EscenaBase from './escenaBase.js';

var config = {
    type: Phaser.AUTO,
    scale: {    
        mode: Phaser.Scale.FIT,
        parent: "superficie_juego",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 320,
        height: 180
    },
    //backgroundColor: '#87CEEB',
    scene: EscenaBase,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    pixelArt: true,
}

var game = new Phaser.Game(config);