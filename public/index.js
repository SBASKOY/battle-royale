

const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const W = canvas.clientWidth;
const H = canvas.clientHeight;
const TILE_W = 64;
const TILE_H = 64;

const socket = io();




class Game {
    constructor() {
        this.ctx = canvas.getContext("2d");
        this.W = canvas.clientWidth;
        this.H = canvas.clientHeight;
        this.layer = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 1, 0, 2, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 2, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
        ];
        this.images = [
            this.loadImage("./assets/layers/0.png"),
            this.loadImage("./assets/layers/1.png"),
            this.loadImage("./assets/layers/2.png"),
            //this.loadImage("./assets/layers/3.png"),
        ]
        this.players = [];
        this.bullets = []
        this.medkits = [];
        this.bulletUpgrade = [];
        this.circle = {};
        this.status = {};
        this.isGameOver = false;
        this.bulletSpeed = 10;
        this.bulletDamage = 1;
        this.bulletCount = 0;
        this.addEvent();
    }
    getMousePosition = (canvas, event) => {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        return { x, y };
    }
    addEvent = () => {
        window.addEventListener("keydown", (e) => {
            this.players.forEach(player => player.keyDown(e.keyCode));
        })

        window.addEventListener("keyup", (e) => {
            this.players.forEach(player => player.keyUp(e.keyCode));
        })
        canvas.addEventListener("click", (e) => {
            this.players.forEach(player => player.mouseClick(this.getMousePosition(canvas, e)));

        });
    }
    loadImage = (path) => {
        var image = new Image();
        image.src = path;
        return image;
    }

    draw = () => {
        this.ctx.fillStyle = 'rgba(0,0,255,0.5)';
        this.ctx.fillRect(0, 0, W, H);
        var cols = W / TILE_W;
        var rows = H / TILE_H;
        // console.log(this.images.tile0);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var imageType = this.layer[i][j];
                // console.log(imageType)
                this.ctx.drawImage(this.images[imageType], i * TILE_W, j * TILE_H, TILE_W, TILE_H);
            }
        }
        if (this.isGameOver) {
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "red"
            this.ctx.textAlign = "center";
            this.ctx.fillText("Öldünüz. İzleyeci Modundasınız", (W / 2), 50);
        }
        if (!this.status.isStart) {
            this.ctx.font = "15px Arial";
            this.ctx.fillStyle = "blue"
            this.ctx.textAlign = "center";
            this.ctx.fillText(this.status.msg, (W / 2), 75);
        }
        this.ctx.font = "15px Arial";
        this.ctx.fillStyle = "white"
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Mermi Sayısı: ${this.bulletCount} - Mermi Hızı: ${this.bulletSpeed}, Mermi Hasarı: ${this.bulletDamage}`, 110, 30);
        this.ctx.beginPath();
        this.ctx.arc(this.circle.centerX, this.circle.centerY, this.circle.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
    update = () => {
        this.draw();
        this.players.forEach(player => player.update());
        this.medkits.forEach(m => m.update());
        this.bulletUpgrade.forEach(m => m.update());
        this.bullets.forEach(bullet => { bullet.update(); });
    }
}


var game = new Game();
socket.on("CİRCLE", (circle) => {
    game.circle = circle;
})
socket.on("PLAYER_UPDATE", (data) => {
    game.bulletSpeed = data.speed;
    game.bulletDamage = data.damage;
    game.bulletCount = data.bullets

})
socket.on("GAME_UPDATE", ({ status, bulletUpgrade, medkits, players, bullets }) => {
    //console.log(medkits)
    var newPlayers = players.map(player => new Player(game, ctx, player.id, player.x, player.y, player.type, player.healty));
    var newBullets = bullets.map(bullet => new Bullet(ctx, bullet.id, bullet.playerID, bullet.x, bullet.y, bullet.color));
    var newMedkits = medkits.map(i => new Medkit(ctx, i.x, i.y, i.w, i.h));
    var newBulletUpgrade = bulletUpgrade.map(i => new BulletUpgrade(ctx, i.x, i.y, i.w, i.h));
    game.players = newPlayers;
    game.bullets = newBullets;
    game.medkits = newMedkits;
    game.bulletUpgrade = newBulletUpgrade;
    game.status = status;
    var currentPlayer = game.players.find(i => i.id == socket.id);
    if (!currentPlayer || currentPlayer.isActive) {
        game.isGameOver = true;
    }
});

var interval = setInterval(() => {
    game.update();
}, 60)

