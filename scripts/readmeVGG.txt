movimiento (A/D/←/→), salto (W/SPACE/↑), ataque-roll (S) y sistema de daño con invulnerabilidad.
Cuando vuestro equipo integre enemigos, solo tenéis que hacer physics.overlap(player.hitboxAtaque, enemigos, ...) 
para que el ataque les pegue, y llamar a player.
recibirDano(1, enemigo.x) cuando un enemigo toque al jugador. ¡Suerte con la entrega! 🦊