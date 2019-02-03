module.exports = function proxy(http) {
     const io = require('socket.io')(http, { pingInterval: 10, pingTimeout: 4000 });
     const repo = require('./repository');
     repo.inject(io);
}
