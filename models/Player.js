

class Player {
    constructor(game, socket) {
        this.id = socket.id;
        this.game = game;
        this.posx = this.getRandom(100, this.game.W - 100);;
        this.posy = this.getRandom(100, this.game.H - 100);;
        this.dirx = 0;
        this.diry = 0;
        this.width = 20;
        this.height = 20;
        this.speed = 5;
        this.targetX = this.posx;
        this.targetY = this.posy;
        this.imagePath = `./assets/players/${this.getRandom(0, 4)}.png`;
        this.isDeath = false;
        this.healty = 100;
        this.bulletSpeed = 10;
        this.bulletDamage=1;
        this.bulletColor=this.getRandomColor();
        this.bulletUpgradeCreated=Date.now();
        this.bulletUpgrade=false;
        this.socket=socket;
    }
    getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }
    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    move = () => {
        this.targetX += this.dirx * this.speed;
        this.targetY += this.diry * this.speed;
        this.posx += (this.targetX - this.posx) * 0.5;
        this.posy += (this.targetY - this.posy) * 0.5;

        if (this.posx + 20 > this.game.W) this.posx = this.game.W - 20;
        if (this.posx < 0) this.posx = 0;
        if (this.posy < 0) this.posy = 0;
        if (this.posy + 20 > this.game.H) this.posy = this.game.H - 20;

    }
    update = () => {
        this.move();
        this.socket.emit("PLAYER_UPDATE",{
            damage:this.bulletDamage,
            speed:this.bulletSpeed
        })
        if(this.bulletUpgrade){
            var now = Date.now();
            if (now - this.bulletUpgradeCreated > 5000) {
                this.bulletSpeed = 10;
                this.bulletDamage = 1;
                this.bulletUpgrade = false;
            }
        }
        if (this.healty < 1) {
            this.isDeath = true;
        }
    }
}
module.exports = Player;