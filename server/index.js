const Koa = require('koa');
const app = new Koa();
const http = require('http').createServer(app.callback());
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const repo = require('./repository');

http.listen(port, function () {
    console.log(`listening on *:${port}`);
});

repo.inject(io);
