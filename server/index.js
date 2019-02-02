module.exports = function proxy(http) {
     const io = require('socket.io')(http);
     const repo = require('./repository');
     repo.inject(io);
}
