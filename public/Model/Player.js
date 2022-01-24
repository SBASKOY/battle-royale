
const leftKey = 65;
const topKey = 87;
const bottomKey = 83;
const rightKey = 68;
const spaceKey = 32;

class Player {
    constructor(game, ctx,id, posx, posy,type,healty) {
        this.id = id;
        this.game = game;
        this.ctx = ctx;
        this.posx = posx;
        this.posy = posy;
        this.width = 20;
        this.height = 20;
        this.targetX = posx;
        this.targetY = posy;
        this.imagePath = type;
        this.isDeath = false;
        this.healty = healty;
        this.bulletSpeed = 10;

    }
    loadImage = () => {
        var image = new Image();
        image.src = this.imagePath;
        return image;
    }
    draw = () => {
        this.ctx.font = "15px Arial";
        this.ctx.fillStyle = "red"
        ctx.fillText(this.healty, this.posx, this.posy);
        this.ctx.drawImage(this.loadImage(), this.posx, this.posy, this.width, this.height);
    }
 
    update = () => {
        this.draw();
    }
    keyDown = (keyCode) => {
        if (keyCode == leftKey)socket.emit("PLAYER_MOVE",{dirx:-1})
        else if (keyCode == rightKey) socket.emit("PLAYER_MOVE", { dirx: 1 })
        if (keyCode == topKey) socket.emit("PLAYER_MOVE", { diry: -1 })
        else if (keyCode == bottomKey) socket.emit("PLAYER_MOVE", { diry: 1 })
    }
    keyUp = (keyCode) => {
        if (keyCode == leftKey || keyCode == rightKey) socket.emit("PLAYER_MOVE", { dirx: 0 })
        if (keyCode == topKey || keyCode == bottomKey) socket.emit("PLAYER_MOVE", { diry: 0 })
    }
    mouseClick = ({ x, y }) => {
       
        socket.emit("FIRE",{x:x,y:y})
       
    }
}