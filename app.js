

const Game = require("./models/Game");
const { server, io, app } = require("./services/initApp");

const game = new Game();

var circleInterval;
function startCircle() {
    return setInterval(() => {
        game.onCircleInside();
        game.addMetkit();
        game.addBulletUpgrade();
        if (game.circle.radius % 100 == 0) {
            game.circleDec = false;
            game.circleCount++;
        }
        if (game.circleCount == 5) {
            game.circleCount = 0;
            game.circleDec = true;
            game.changeCenter();
        }
        if (game.circle.radius < 55) {
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
    if (game.players.length < 2) {
        game.isStart = false;
        game.reset();
        clearInterval(circleInterval);
    }

    io.emit("GAME_UPDATE", {
        status: {
            isStart: game.isStart,
            msg: `Oyuncular bekleniyor. Mevcut Oyuncu ${game.players.length}`
        },
        bulletUpgrade:game.bulletUpgrade.map(i=>({x:i.posx,y:i.posy,w:i.w,h:i.h})),
        medkits: game.medkits.map(i => ({ x: i.posx, y: i.posy,w:i.w,h:i.h })),
        players: game.players.map(i => ({
            id: i.id,
            x: i.posx,
            y: i.posy,
            type: i.imagePath,
            healty: i.healty
        })),
        bullets: game.bullets.map(i => ({
            id: i.id,
            playerID: i.playerID,
            x: i.posx,
            y: i.posy,
            color: i.color
        }))
    })
}, 60);

io.on('connection', (socket) => {

    game.addPlayer(socket);
    if (game.players.length > 1) {
        if (game.isStart == false) {
            circleInterval = startCircle();
            game.isStart = true;
        }
    }
    socket.on("FIRE", (data) => {
        var player = game.players.find(i => i.id === socket.id);
        if (player) {
            if(player.bulletCount>1){
                game.addBullet(player, data);
                player.bulletCount=Math.max(0,player.bulletCount-1);
            }
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
