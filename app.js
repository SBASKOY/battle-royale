

const Game = require("./models/Game");
const Bullet = require("./models/Bullet");
const Player = require("./models/Player");

const { server, io, app } = require("./services/initApp");

const game = new Game();

setInterval(() => {
    game.update();
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
                y: i.posy
            }
        })
    })
}, 60);

io.on('connection', (socket) => {
    console.log(`user connection ${socket.id}`);
    var player = new Player(game, socket.id, 100, 100);
    game.players.push(player);

    socket.on("FIRE", (data) => {
        var player = game.players.find(i => i.id === socket.id);
        if (player) {
            var d = Math.sqrt(Math.pow(Math.abs(player.posx - data.x), 2) + Math.pow(Math.abs(player.posy - data.y), 2))
            var xChange = (data.x - player.posx) / (d / player.bulletSpeed);
            var yChange = (data.y - player.posy) / (d / player.bulletSpeed);
            game.bullets.push(new Bullet({
                id: player.id,
                posx: player.posx,
                posy: player.posy,
            }, xChange, yChange));
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
        console.log(`user disconnected ${socket.id}`);
    });
});

const PORT = process.env.PORT || 1998;
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
server.listen(PORT, () => {
    console.log(`App running ${PORT} port`)
})
