class Game {
    constructor() {
        this.players = [];
        this.bullets = [];
        this.W = 512;
        this.H = 512;
    }
    onBulletCollion = () => {
        this.bullets.forEach(bullet => {
            this.players.forEach(player => {
                if (bullet.posx > player.posx
                    && bullet.posx < player.posx + player.width
                    && bullet.posy > player.posy
                    && bullet.posy < player.posy + player.height
                    && bullet.playerID != player.id
                ) {

                    if (bullet.isActive) {
                        player.healty -= 1;
                        bullet.isActive = false;
                    }
                }
            })
        });
    }
    update = () => {
        this.players.forEach(player => player.update());
        this.bullets.forEach(bullet => {
            bullet.update();
            if (bullet.posx > this.W || bullet.posy < 0 || bullet.posy < 0 || bullet.posy > this.H) {
                bullet.isActive = false;
            }
        });
        this.onBulletCollion();
        this.bullets = this.bullets.filter(i => i.isActive);
        this.players = this.players.filter(i => i.isDeath == false);
        // console.log(this.bullets.length);
    }
}
module.exports = Game;