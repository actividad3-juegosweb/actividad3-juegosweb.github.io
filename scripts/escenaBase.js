

export default class EscenaBase extends Phaser.Scene {

    preload(){
        // tileset
        this.load.image('tilesheet', 'assets/Sprites/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
    }

    create(){
        this.mapa = this.make.tilemap({key:'map'});
        this.hojaTiles = this.mapa.addTilesetImage('tileset', 'tilesheet', 16, 16, 0, 0);

       this.backgroundFixed = this.mapa.createLayer('background_fixed', this.hojaTiles, 0, 0);
       this.background = this.mapa.createLayer('background', this.hojaTiles, 0, 0);
       this.solid = this.mapa.createLayer('solid', this.hojaTiles, 0, 0);
       this.platforms = this.mapa.createLayer('platforms', this.hojaTiles, 0, 0);
        this.foreground = this.mapa.createLayer('foreground', this.hojaTiles, 0, 0);
    }

    update(){

    }
}