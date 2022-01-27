
const Bullet = require("./Bullet");
const Player = require("./Player");
const MedKit = require("./Medkit");
const BulletUpgrade = require("./BulletUpgrade");
class Game {
    constructor() {
        this.players = [];
        this.bullets = [];
        this.medkits = [];
        this.bulletUpgrade = [];
        this.W = 512;
        this.H = 512;
        this.circle = {
            centerX: this.getRandom(100, this.W - 100),
            centerY: this.getRandom(100, this.H - 100),
            radius: 300
        };
        this.circleDec = true;
        this.circleCount = 0;
        this.isStart = false;
    }
    reset = () => {
        this.circle = {
            centerX: this.getRandom(100, this.W - 100),
            centerY: this.getRandom(100, this.H - 100),
            radius: 300
        };
        this.players.forEach(player => player.healty = 100);
    }
    changeCenter = () => {
        this.circle.centerX = this.getRandom(100, this.W - 100);
        this.circle.centerY = this.getRandom(100, this.H - 100);
    }
    getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

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
                        player.healty -= bullet.damage;
                        bullet.isActive = false;
                    }
                }
            })
        });
    }
    onMedkitCollision = () => {
        this.medkits.forEach(medkit => {
            this.players.forEach(player => {
                if (this.onFindDistance(player.posx, medkit.posx, player.posy, medkit.posy) < 10) {
                    if (medkit.isActive) {
                        if (player.healty < 100) {
                            player.healty += medkit.healty;
                            if (player.healty > 100) {
                                player.healty == 100
                            }
                        }
                        medkit.isActive = false;
                    }
                }
            })
        });
    }
    onFindDistance = (x1, x2, y1, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    onBulletUpgradeCollision = () => {
        this.bulletUpgrade.forEach(upgrade => {
            this.players.forEach(player => {
                if (this.onFindDistance(player.posx, upgrade.posx, player.posy, upgrade.posy) < 15) {
                    if (upgrade.isActive) {
                        player.bulletSpeed = upgrade.speed;
                        player.bulletDamage = upgrade.damage;
                        player.bulletUpgrade = true;
                        player.bulletUpgradeCreated = Date.now();
                        player.bulletCount += upgrade.count
                        upgrade.isActive = false;
                    }
                }
            })
        });
    }
    pointInCircle = (x, y, cx, cy, radius) => {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    }
    onCircleInside = () => {
        var cx = this.circle.centerX;
        var cy = this.circle.centerY;
        var radius = this.circle.radius;
        this.players.forEach(player => {
            if (!this.pointInCircle(player.posx, player.posy, cx, cy, radius)) {
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
        this.medkits.forEach(medkit => medkit.update());
        this.bulletUpgrade.forEach(b => b.update());
        this.onBulletCollion();
        this.onMedkitCollision();
        this.onBulletUpgradeCollision();
        this.bullets = this.bullets.filter(i => i.isActive);
        this.medkits = this.medkits.filter(i => i.isActive);
        this.bulletUpgrade = this.bulletUpgrade.filter(i => i.isActive);
        this.players = this.players.filter(i => i.isDeath == false);

        // console.log(this.bullets.length);
    }
    addBullet = (player, data) => {
        var d = Math.sqrt(Math.pow(Math.abs(player.posx - data.x), 2) + Math.pow(Math.abs(player.posy - data.y), 2))
        var xChange = (data.x - player.posx) / (d / player.bulletSpeed);
        var yChange = (data.y - player.posy) / (d / player.bulletSpeed);

        this.bullets.push(new Bullet({
            id: player.id,
            posx: player.posx,
            posy: player.posy,
            damage: player.bulletDamage
        }, xChange, yChange, player.bulletColor));
    }
    addPlayer(id) {
        var player = new Player(this, id);
        this.players.push(player);
    }
    addMetkit = () => {
        if (this.medkits.length < 5) {
            this.medkits.push(new MedKit(this))
        }
    }
    addBulletUpgrade = () => {
        if (this.bulletUpgrade.length < 5) {
            this.bulletUpgrade.push(new BulletUpgrade(this))
        }
    }
}
module.exports = Game;