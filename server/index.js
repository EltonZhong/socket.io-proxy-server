/**
 * Proxy and Modify packet as you like.
 * @returns SocketsManager
 * Usage: Modify packet with a reqHandler, and packet from client will be modified.
 * Usage: Modify packet with a respHandler, and packet from server will be modified.
 * 
 * Below is the example:
 * ===========================================================
 *   manager.addReqHandler(async function(proxySocket, packet) {
          console.log('req');
          console.log(arguments);
     });

     manager.addRespHandler(async function() {
          console.log('resp');
          console.log(arguments);
     });
 * ===========================================================
 */
module.exports = function proxy(http) {
     // For transport close: you need const io = require('socket.io')(http, { pingInterval: 100, pingTimeout: 4000 });
     const io = require('socket.io')(http);
     const manager = require('./manager');
     manager.inject(io);
     return manager;
}
