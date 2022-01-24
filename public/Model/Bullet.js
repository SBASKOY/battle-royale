class Bullet {
    constructor(ctx,id,playerID,posx,posy) {
        this.id = id;
        this.playerID =playerID,
        this.ctx = ctx;
        this.posx = posx;
        this.posy = posy;
        this.imagePath = "./assets/bullets/0.png"


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
        this.ctx.drawImage(this.loadImage(), this.posx, this.posy, 5, 5);
    }

}