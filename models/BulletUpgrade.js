
class BulletUpgrade {
    constructor(game) {
        this.id = new Date().getTime();
        this.game = game;
        this.posx = this.getRandom(100, this.game.W - 100)
        this.posy = this.getRandom(100, this.game.W - 100)
        this.isActive = true;
        this.speed = this.getRandom(10,20);
        this.damage=this.getRandom(5,10);
        this.count=10;
        this.w = 10;
        this.h = 10;
        this.created = Date.now();

    }
    update = () => {
        var now = Date.now();
        if (now - this.created > 10000) {
            this.isActive = false;
        }
    }
    getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

}
module.exports = BulletUpgrade;