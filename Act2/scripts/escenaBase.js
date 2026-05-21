import Gema from './gema.js';
import Bandera from './bandera.js';
import Jugador from './jugador.js';

export default class EscenaBase extends Phaser.Scene {

    preload(){
        this.load.image('gemaAzul', 'assets/gem_blue.png');
        this.load.image('gemaRoja', 'assets/gem_red.png');
        this.load.image('gemaVerde', 'assets/gem_green.png');
        this.load.image('gemaAmarilla', 'assets/gem_yellow.png');
        this.load.image('llaveAzul', 'assets/key_blue.png');
        this.load.image('llaveRoja', 'assets/key_red.png');
        this.load.image('llaveVerde', 'assets/key_green.png');
        this.load.image('llaveAmarilla', 'assets/key_yellow.png');
        this.load.image('bandera', 'assets/flag.png');
        this.load.image('coin', 'assets/coin_gold.png');
        this.load.atlas('spr_player', 'assets/spr_player.png', 'assets/spr_player_atlas.json');
        this.load.image('tilesheet', 'assets/tiles.png');
        this.load.tilemapTiledJSON('map', 'assets/mapa.json');
        this.load.image('jugador', 'assets/prota.png');
    }

    create() {
        this.mapa = this.make.tilemap({key:'map'});
        this.hojaTiles = this.mapa.addTilesetImage('tiles', 'tilesheet', 64, 64, 0, 0);
        this.plataformas = this.mapa.createLayer('plataformas', this.hojaTiles, 0, 0);
        this.muroAzul = this.mapa.createLayer('muroAzul', this.hojaTiles, 0, 0);
        this.muroRojo = this.mapa.createLayer('muroRojo', this.hojaTiles, 0, 0);
        this.muroVerde = this.mapa.createLayer('muroVerde', this.hojaTiles, 0, 0);
        this.muroAmarillo = this.mapa.createLayer('muroAmarillo', this.hojaTiles, 0, 0);

        this.jugador = new Jugador(this, 200, 400);
        this.plataformas.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.jugador, this.plataformas);
        this.muroAzul.setCollisionByExclusion(-1, true);
        this.colliderAzul = this.physics.add.collider(this.jugador, this.muroAzul);
        this.muroRojo.setCollisionByExclusion(-1, true);
        this.colliderRojo = this.physics.add.collider(this.jugador, this.muroRojo);
        this.muroVerde.setCollisionByExclusion(-1, true);
        this.colliderVerde = this.physics.add.collider(this.jugador, this.muroVerde);
        this.muroAmarillo.setCollisionByExclusion(-1, true);
        this.colliderAmarillo = this.physics.add.collider(this.jugador, this.muroAmarillo);

        // control de camaras
        this.cameras.main.startFollow(this.jugador);
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);

        // incorporar gemas desde json
        if (this.mapa.getObjectLayer('gemasAzules')!=null){
            this.objetos = this.mapa.getObjectLayer('gemasAzules').objects;
            this.totalAzul = this.objetos.length;
            this.objetos.forEach(objeto => {
                this.gema = new Gema(this, objeto.x, objeto.y, 'gemaAzul', 1, this.objetos.length);
                this.physics.add.collider(this.gema, this.plataformas);

                // para recoger gemas
                this.physics.add.collider(this.gema, this.jugador, this.colGemaJugador, null, this);
            })
        } else {
            console.log('No hay capa de objetos');
        }

        if (this.mapa.getObjectLayer('gemasVerdes')!=null){
            this.objetos = this.mapa.getObjectLayer('gemasVerdes').objects;
            this.totalVerde = this.objetos.length;
            this.objetos.forEach(objeto => {
                this.gema = new Gema(this, objeto.x, objeto.y, 'gemaVerde', 2, this.objetos.length);
                this.physics.add.collider(this.gema, this.plataformas);

                // para recoger gemas
                this.physics.add.collider(this.gema, this.jugador, this.colGemaJugador, null, this);
            })
        } else {
            console.log('No hay capa de objetos');
        }

        if (this.mapa.getObjectLayer('gemasRojas')!=null){
            this.objetos = this.mapa.getObjectLayer('gemasRojas').objects;
            this.totalRojo = this.objetos.length;
            this.objetos.forEach(objeto => {
                this.gema = new Gema(this, objeto.x, objeto.y, 'gemaRoja', 3, this.objetos.length);
                this.physics.add.collider(this.gema, this.plataformas);

                // para recoger gemas
                this.physics.add.collider(this.gema, this.jugador, this.colGemaJugador, null, this);
            })
        } else {
            console.log('No hay capa de objetos');
        }

        if (this.mapa.getObjectLayer('gemasAmarillas')!=null){
            this.objetos = this.mapa.getObjectLayer('gemasAmarillas').objects;
            this.totalAmarillo = this.objetos.length;
            this.objetos.forEach(objeto => {
                this.gema = new Gema(this, objeto.x, objeto.y, 'gemaAmarilla', 4, this.objetos.length);
                this.physics.add.collider(this.gema, this.plataformas);

                // para recoger gemas
                this.physics.add.collider(this.gema, this.jugador, this.colGemaJugador, null, this);
            })
        } else {
            console.log('No hay capa de objetos');
        }

        if (this.mapa.getObjectLayer('bandera')!=null){
            this.objetos = this.mapa.getObjectLayer('bandera').objects;
            this.objetos.forEach(objeto => {
                this.bandera = new Bandera(this, objeto.x, objeto.y);
                this.physics.add.collider(this.gema, this.bandera);

                // para recoger gemas
                this.physics.add.collider(this.bandera, this.jugador, this.colBanderaJugador, null, this);
            })
        } else {
            console.log('No hay capa de objetos');
        }

        // Marcador
        this.puntosTotales = 0;

        this.imageMarcadorAzul = this.add.image(40,40,'gemaAzul');
        this.imageMarcadorAzul.setScale(1); // duplicamos el tamaño
        this.imageMarcadorAzul.setScrollFactor(0); // evitamos que se mueva con la camara

        this.puntosAzules = 0;
        this.txtMarcadorAzul = this.add.text(70,20, this.puntosAzules+"/"+this.totalAzul);
        this.txtMarcadorAzul.setFontSize(40);
        this.txtMarcadorAzul.setStyle({fontStyle: 'bold italic'});
        this.txtMarcadorAzul.setFill('#000');
        this.txtMarcadorAzul.setScrollFactor(0); // evitar que se mueva con la camara


        this.imageMarcadorVerde = this.add.image(40,80,'gemaVerde');
        this.imageMarcadorVerde.setScale(1); // duplicamos el tamaño
        this.imageMarcadorVerde.setScrollFactor(0); // evitamos que se mueva con la camara

        this.puntosVerdes = 0;
        this.txtMarcadorVerde = this.add.text(70,60, this.puntosVerdes+"/"+this.totalVerde);
        this.txtMarcadorVerde.setFontSize(40);
        this.txtMarcadorVerde.setStyle({fontStyle: 'bold italic'});
        this.txtMarcadorVerde.setFill('#000');
        this.txtMarcadorVerde.setScrollFactor(0); // evitar que se mueva con la camara



        this.imageMarcadorRojo = this.add.image(40,120,'gemaRoja');
        this.imageMarcadorRojo.setScale(1); // duplicamos el tamaño
        this.imageMarcadorRojo.setScrollFactor(0); // evitamos que se mueva con la camara

        this.puntosRojos = 0;
        this.txtMarcadorRojo = this.add.text(70,100, this.puntosRojos+"/"+this.totalRojo);
        this.txtMarcadorRojo.setFontSize(40);
        this.txtMarcadorRojo.setStyle({fontStyle: 'bold italic'});
        this.txtMarcadorRojo.setFill('#000');
        this.txtMarcadorRojo.setScrollFactor(0); // evitar que se mueva con la camara


        this.imageMarcadorAmarillo = this.add.image(40,160,'gemaAmarilla');
        this.imageMarcadorAmarillo.setScale(1); // duplicamos el tamaño
        this.imageMarcadorAmarillo.setScrollFactor(0); // evitamos que se mueva con la camara

        this.puntosAmarillos = 0;
        this.txtMarcadorAmarillo = this.add.text(70,140, this.puntosAmarillos+"/"+this.totalAmarillo);
        this.txtMarcadorAmarillo.setFontSize(40);
        this.txtMarcadorAmarillo.setStyle({fontStyle: 'bold italic'});
        this.txtMarcadorAmarillo.setFill('#000');
        this.txtMarcadorAmarillo.setScrollFactor(0); // evitar que se mueva con la camara


        this.imagenMarcadorMonedas = this.add.image(1080,40,'coin');
        this.imagenMarcadorMonedas.setScale(1); // duplicamos el tamaño
        this.imagenMarcadorMonedas.setScrollFactor(0); // evitamos que se mueva con la camara

        this.txtMarcadorMonedas= this.add.text(1110,20, this.puntosTotales);
        this.txtMarcadorMonedas.setFontSize(40);
        this.txtMarcadorMonedas.setStyle({fontStyle: 'bold italic'});
        this.txtMarcadorMonedas.setFill('#000');
        this.txtMarcadorMonedas.setScrollFactor(0); // evitar que se mueva con la camara

    }

    update(){
        this.jugador.update();
    }

    colGemaJugador(gema, jugador){
        gema.destroy(true);
        console.log(gema.valor);
        this.puntosTotales = this.puntosTotales + gema.valor;
        this.txtMarcadorMonedas.text = this.puntosTotales;

        switch (gema.tipo) {
            case 1:
                this.puntosAzules = this.puntosAzules + 1;
                this.txtMarcadorAzul.text = this.puntosAzules + "/" + gema.total;
                if (this.puntosAzules >= gema.total){
                    this.imageMarcadorAzul.setTexture('llaveAzul');
                    this.txtMarcadorAzul.destroy();
                    this.colliderAzul.destroy();
                    this.muroAzul.destroy();
                    
                }
                break;
            case 2:
                this.puntosVerdes = this.puntosVerdes + 1;
                this.txtMarcadorVerde.text = this.puntosVerdes + "/" + gema.total;
                if (this.puntosVerdes >= gema.total){
                    this.imageMarcadorVerde.setTexture('llaveVerde');
                    this.txtMarcadorVerde.destroy();
                    this.colliderVerde.destroy();
                    this.muroVerde.destroy();
                }
                break;
            case 3:
                this.puntosRojos = this.puntosRojos + 1;
                this.txtMarcadorRojo.text = this.puntosRojos + "/" + gema.total;
                if (this.puntosRojos >= gema.total){
                    this.imageMarcadorRojo.setTexture('llaveRoja');
                    this.txtMarcadorRojo.destroy();
                    this.colliderRojo.destroy();
                    this.muroRojo.destroy();
                }
                break;
            case 4:
                this.puntosAmarillos = this.puntosAmarillos + 1;
                this.txtMarcadorAmarillo.text = this.puntosAmarillos + "/" + gema.total;
                if (this.puntosAmarillos >= gema.total){
                    this.imageMarcadorAmarillo.setTexture('llaveAmarilla');
                    this.txtMarcadorAmarillo.destroy();
                    this.colliderAmarillo.destroy();
                    this.muroAmarillo.destroy();
                }
                break;
            default:
                break;
        }
    }

    colBanderaJugador(bandera, jugador){
        bandera.destroy(true);
        this.txtWin = this.add.text(300,0, 'You\nWIN ');
        this.txtWin.setFontSize(300);
        this.txtWin.setStyle({fontStyle: 'bold italic'});
        this.txtWin.setFill('#3e3e3e');
        this.txtWin.setScrollFactor(0);
    }
}