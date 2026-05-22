import EscenaBase from './escenaBase2.js';

const config = {
    type: Phaser.AUTO,
    scale: {    
        mode: Phaser.Scale.FIT,
        parent: "superficie_juego",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 2200,
        height: 1000
    },
    backgroundColor: '#87cfeb',
    scene: EscenaBase,
    physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 500 },
        debug: false,
        fps: 60
    }
},
render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true
}

}
new Phaser.Game(config);
