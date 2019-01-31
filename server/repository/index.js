const ProxySocket = require('../model/ProxySocket');
const _ = require('lodash');

class SocketsRepository {
    constructor() {
        this.io = undefined;
        this.proxySockets = [];
    }

    inject(io) {
        this.io = io;
        this.init();
    }

    init() {
        this.io.on('connection', (socket) => {
            this.register(socket);
        })
    }

    register(socket) {
        console.log(socket.handshake.query);
        console.log(`A socket ${socket.id} connect. got ${this.proxySockets.length + 1}`);
        const proxySocket = ProxySocket.proxyWith(socket);
        this.proxySockets.push(proxySocket);
        socket.on('disconnect', () => {
            console.log(`A socket with id ${socket.id} disconnect. left ${this.proxySockets.length}`);
            _.remove(this.proxySockets, proxySocket);
        });
    }
}

class ServerUtils {

}

module.exports = new SocketsRepository();
