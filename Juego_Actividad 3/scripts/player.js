export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(escena, x, y){
        super(escena, x, y, 'player-idle-1');
        this.escena = escena;
        this.escena.add.existing(this);
        this.escena.physics.add.existing(this);

        this.setScale(1);
        this.body.setSize(20, 28).setOffset(6, 4); // ajusta a tu sprite (Foxy ~33x32)
        this.setCollideWorldBounds(true);

        // ----- Controles -----
        this.cursors = this.escena.input.keyboard.createCursorKeys();
        this.teclas = this.escena.input.keyboard.addKeys({
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha:   Phaser.Input.Keyboard.KeyCodes.D,
            salto:     Phaser.Input.Keyboard.KeyCodes.SPACE,
            saltoW:    Phaser.Input.Keyboard.KeyCodes.W,
            ataque:    Phaser.Input.Keyboard.KeyCodes.S
        });

        // ----- Parámetros -----
        this.velocidad        = 120;
        this.velocidadSalto   = 280;
        this.velocidadRoll    = 200;
        this.vidaMax          = 3;
        this.vida             = this.vidaMax;
        this.duracionAtaque   = 280; // ms que dura el roll
        this.cooldownAtaque   = 500;
        this.tiempoInvulnerable = 1000;

        // ----- Estado -----
        this.atacando     = false;
        this.puedeAtacar  = true;
        this.invulnerable = false;
        this.muerto       = false;

        // ----- Hitbox de ataque -----
        this.hitboxAtaque = this.escena.add.zone(x, y, 28, 24);
        this.escena.physics.add.existing(this.hitboxAtaque);
        this.hitboxAtaque.body.setAllowGravity(false);
        this.hitboxAtaque.body.enable = false;

        this.crearAnimaciones();
        this.play('player_idle');
    }

    crearAnimaciones() {
        const anims = this.escena.anims;
        const framesDe = (prefijo, n) => Array.from({ length: n }, (_, i) => ({ key: `${prefijo}-${i + 1}` }));

        if (!anims.exists('player_idle')) {
            anims.create({ key: 'player_idle', frames: framesDe('player-idle', 4), frameRate: 6, repeat: -1 });
        }
        if (!anims.exists('player_run')) {
            anims.create({ key: 'player_run', frames: framesDe('player-run', 6), frameRate: 12, repeat: -1 });
        }
        if (!anims.exists('player_jump')) {
            anims.create({ key: 'player_jump', frames: framesDe('player-jump', 2), frameRate: 8, repeat: -1 });
        }
        if (!anims.exists('player_hurt')) {
            anims.create({ key: 'player_hurt', frames: framesDe('player-hurt', 2), frameRate: 8, repeat: 2 });
        }
        if (!anims.exists('player_roll')) {
            anims.create({
                key: 'player_roll',
                frames: [{ key: 'Roll1' }, { key: 'Roll2' }, { key: 'Roll3' }, { key: 'Roll4' }],
                frameRate: 12
            });
        }
    }

    update(){
        if (this.muerto) return;

        if (this.body.velocity.x > 0)      this.setFlipX(false);
        else if (this.body.velocity.x < 0) this.setFlipX(true);

        if (!this.atacando) {
            this.gestionarMovimiento();
            this.gestionarSalto();
        }

        if (Phaser.Input.Keyboard.JustDown(this.teclas.ataque) && this.puedeAtacar) {
            this.atacar();
        }

        if (this.hitboxAtaque.body.enable) {
            const offsetX = this.flipX ? -this.width / 2 : this.width / 2;
            this.hitboxAtaque.setPosition(this.x + offsetX, this.y);
        }
    }

    gestionarMovimiento() {
        const izq = this.cursors.left.isDown  || this.teclas.izquierda.isDown;
        const der = this.cursors.right.isDown || this.teclas.derecha.isDown;

        if (izq) {
            this.setVelocityX(-this.velocidad);
            if (this.body.onFloor()) this.play('player_run', true);
        } else if (der) {
            this.setVelocityX(this.velocidad);
            if (this.body.onFloor()) this.play('player_run', true);
        } else {
            this.setVelocityX(0);
            if (this.body.onFloor()) this.play('player_idle', true);
        }

        if (!this.body.onFloor()) this.play('player_jump', true);
    }

    gestionarSalto() {
        const saltar = this.cursors.space.isDown || this.teclas.salto.isDown || this.teclas.saltoW.isDown || this.cursors.up.isDown;
        if (saltar && this.body.onFloor()) {
            this.setVelocityY(-this.velocidadSalto);
            this.play('player_jump', true);
        }
    }

    // Ataque tipo "roll": Foxy rueda hacia delante y daña con la hitbox
    atacar() {
        this.atacando = true;
        this.puedeAtacar = false;

        const dir = this.flipX ? -1 : 1;
        this.setVelocityX(dir * this.velocidadRoll);

        this.hitboxAtaque.body.enable = true;
        this.play('player_roll', true);
        this.escena.events.emit('jugador-ataca', this.hitboxAtaque);

        this.escena.time.delayedCall(this.duracionAtaque, () => {
            this.hitboxAtaque.body.enable = false;
            this.atacando = false;
        });
        this.escena.time.delayedCall(this.cooldownAtaque, () => {
            this.puedeAtacar = true;
        });
    }

    recibirDano(cantidad = 1, fuenteX = null) {
        if (this.invulnerable || this.muerto) return;

        this.vida -= cantidad;
        this.invulnerable = true;

        const direccion = (fuenteX !== null && fuenteX > this.x) ? -1 : 1;
        this.setVelocity(direccion * 180, -220);
        this.play('player_hurt', true);

        this.escena.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: Math.floor(this.tiempoInvulnerable / 200)
        });

        this.escena.events.emit('jugador-dano', this.vida);

        if (this.vida <= 0) { this.morir(); return; }

        this.escena.time.delayedCall(this.tiempoInvulnerable, () => {
            this.invulnerable = false;
            this.alpha = 1;
        });
    }

    morir() {
        this.muerto = true;
        this.setVelocity(0, -200);
        this.body.checkCollision.none = true;
        this.play('player_hurt', true);
        this.escena.events.emit('jugador-muerto');
    }
}
