

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
    }
    update = () => {
        this.draw();
        this.players.forEach(player => player.update());
        this.bullets.forEach(bullet => {
            bullet.update();
            if (bullet.posx > W || bullet.posy < 0 || bullet.posy < 0 || bullet.posy > H) {
                bullet.isActive = false;
            }
        });
        this.onBulletCollion();
        this.bullets = this.bullets.filter(i => i.isActive);
        this.players = this.players.filter(i => i.isDeath == false);
        // console.log(this.bullets.length);
    }
}


var game = new Game();
socket.on("GAME_UPDATE", ({ players, bullets }) => {
    var newPlayers = players.map(player => new Player(game, ctx, player.id, player.x, player.y, player.type, player.healty));
    var newBullets = bullets.map(bullet => new Bullet(ctx, bullet.id, bullet.playerID, bullet.x, bullet.y));
    game.players = newPlayers;
    game.bullets = newBullets;

});

var interval = setInterval(() => {
    game.update();
}, 60)

