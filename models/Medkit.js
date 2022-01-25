
class MedKit{
    constructor(game) {
        this.id = new Date().getTime();
        this.game=game;
        this.posx = this.getRandom(100, this.game.W - 100)
        this.posy = this.getRandom(100, this.game.W - 100)
        this.isActive = true;
        this.healty=5;
        this.w=40;
        this.h=40;
        this.created=Date.now();

    }
    update=()=>{
        var now=Date.now();
        if(now - this.created > 7000){
            this.isActive=false;
        }
    }
    getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);
    
}
module.exports=MedKit;