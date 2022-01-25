
class BulletUpgrade {
    constructor(ctx, x, y, w, h) {
        this.posx = x;
        this.posy = y;
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.imagePath = "./assets/bullets/1.png"
    }
    draw = () => {
        this.ctx.drawImage(this.loadImage(), this.posx, this.posy, this.w, this.h);
    }
    loadImage = () => {
        var image = new Image();
        image.src = this.imagePath;
        return image;
    }
    update = () => {
        this.draw();
    }
}