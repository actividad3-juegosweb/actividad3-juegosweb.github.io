import EscenaBase from './escenaBase.js';

var config = {
    type: Phaser.AUTO,
    scale: {    
        mode: Phaser.Scale.FIT,
        parent: "superficie_juego",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 640
    },
    backgroundColor: '#87CEEB',
    scene: EscenaBase,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);