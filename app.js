

const Game = require("./models/Game");
const { server, io, app } = require("./services/initApp");

const game = new Game();

var circleInterval;
function startCircle(){
    return setInterval(() => {
        game.onCircleInside();
        if (game.circle.radius % 100 == 0) {
            game.circleDec = false;
            game.circleCount++;
        }
        if (game.circleCount == 5) {
            game.circleCount = 0;
            game.circleDec = true;
            game.changeCenter();
        }
        if (game.circle.radius < 100) {
            game.circleDec = false;
            clearInterval(circleInterval);
        }
        if (game.circleDec) {
            game.circle.radius -= 5;
            io.emit("CİRCLE", game.circle)
        }
    }, 1000)
}



setInterval(() => {
    game.update();
    if(game.players.length==0){
        game.isStart=false;
    }
    io.emit("GAME_UPDATE", {
        players: game.players.map(i => {
            return {
                id: i.id,
                x: i.posx,
                y: i.posy,
                type: i.imagePath,
                healty: i.healty
            }
        }),
        bullets: game.bullets.map(i => {
            return {
                id: i.id,
                playerID: i.playerID,
                x: i.posx,
                y: i.posy,
                color: i.color
            }
        })
    })
}, 60);

io.on('connection', (socket) => {

    game.addPlayer(socket.id);
    if(game.players.length>1){
        if(game.isStart==false){
            game.resetCenter();
            circleInterval = startCircle();
            game.isStart=true;
        }
    }
    socket.on("FIRE", (data) => {
        var player = game.players.find(i => i.id === socket.id);
        if (player) {
            game.addBullet(player, data);
        } 
    })
    socket.on("PLAYER_MOVE", (data) => {
        var player = game.players.find(i => i.id === socket.id);
        if (player) {
            player.dirx = data.dirx ?? player.dirx;
            player.diry = data.diry ?? player.diry;
        }
    })
    socket.on('disconnect', () => {
        game.players = game.players.filter(player => player.id !== socket.id);

    });
});

const PORT = process.env.PORT || 1998;
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
server.listen(PORT, () => {
    console.log(`App running ${PORT} port`)
})
