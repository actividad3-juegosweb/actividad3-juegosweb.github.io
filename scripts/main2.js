import EscenaBase2 from './escenaBase2.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'superficie_juego',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 640
    },
    backgroundColor: '#87CEEB',
    scene: EscenaBase2,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

new Phaser.Game(config);
