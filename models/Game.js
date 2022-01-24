class Game {
    constructor() {
        this.players = [];
        this.bullets = [];
        this.W = 512;
        this.H = 512;
        this.circle = {
            centerX: this.getRandom(100, this.W - 100),
            centerY: this.getRandom(100, this.H - 100),
            radius: 300
        },
            this.circleDec = true;
    }
    changeCenter = () => {
        this.circle.centerX = this.getRandom(100, this.W - 100);
        this.circle.centerY = this.getRandom(100, this.H - 100);
    }
    getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
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
    pointInCircle = (x, y) => {
        var cx = this.circle.centerX;
        var cy = this.circle.centerY;
        var radius = this.circle.radius;
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    }
    onCircleInside = () => {
        this.players.forEach(player => {
            if (!this.pointInCircle(player.posx, player.posy)) {
                player.healty -= 5;
            }
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