import EscenaBase from './escenaBase2.js';

const config = {
    type: Phaser.AUTO,
    scale: {    
        mode: Phaser.Scale.FIT,
        parent: "superficie_juego",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 500
    },
    backgroundColor: '#87cfeb',
    scene: EscenaBase,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    pixelArt: true,
}

new Phaser.Game(config);
