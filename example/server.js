const Koa = require('koa');
const pretty = require('pretty-format');
const app = new Koa();
const http = require('http').createServer(app.callback());
const io = require('socket.io')(http);

const port = 3333;

http.listen(port, function () {
    console.log(`listening on *:${port}`);
});
app.use(async (context) => {
    console.log('resp!')
})

const se = new Set();
let i = 0;
let j = 0;
io.on('connection', (socket) => {
    console.log(socket.handshake)
    console.log('Sockets still alive:');
    console.log(Object.keys(io.sockets.sockets).length);
    se.add(socket);
    console.log(se.size);
    console.log(pretty(socket.id));
    console.log(socket.id + 'One socket connected:' + i++)

    socket.on('disconnect', () => {
        console.log(socket.id + 'One socket disconnect:' + j++)
        console.log(`There are ${i - j} sockets alive.`)
    });

    socket.use((pack, next) => {
        next();
        socket.emit('do', "d")
    });
    socket.on('hello2', (_, fn) => { fn('Response from server: world22222'); })
    socket.emit('do', "d")
});

io.on('disconnect', () => {
    console.log('I can fly');
})
