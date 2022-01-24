class Bullet {
    constructor(ctx, id, playerID, posx, posy, color) {
        this.id = id;
        this.playerID = playerID,
            this.ctx = ctx;
        this.posx = posx;
        this.posy = posy;
        this.color = color;
        this.isActive = true;
        this.distance = 0;
        this.maxDistance = 10;
    }

    update = () => {
        this.draw();
    }
    loadImage = () => {
        var image = new Image();
        image.src = this.imagePath;
        return image;
    }
    draw = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.posx, this.posy, 3, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        //this.ctx.drawImage(this.loadImage(), this.posx, this.posy, 5, 5);
    }

}