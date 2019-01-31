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
io.on('connection', (socket) => {
    se.add(socket);
    console.log(se.size);
    console.log(pretty(socket.id));
    console.log('One socket connected:')
    socket.on('connect', () => {
        console.log('This is nerver triggered' + socket.id);
    });
    socket.on('disconnect', () => {
        console.log('This is? ? disconnec');
    });
    socket.use((pack, next) => {
        console.log(pack);
        console.log('I can fly2')
        next();
        socket.emit('do', "d")
    });
    socket.on('hello2', (_, fn) => { fn('Response from server: world22222'); })
    socket.emit('do', "d")
});

io.on('disconnect', () => {
    console.log('I can fly');
})
