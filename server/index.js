module.exports = function proxy(http) {
     // For transport close: you need const io = require('socket.io')(http, { pingInterval: 100, pingTimeout: 4000 });
     const io = require('socket.io')(http);
     const repo = require('./repository');
     repo.inject(io);
     return repo;
}
