const ProxySocket = require('../model/ProxySocket');
const _ = require('lodash');
const logger = require('log4js').getLogger('Sockets');

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
        logger.debug(`A socket ${socket.id} connect. got ${this.proxySockets.length + 1}`);
        const proxySocket = ProxySocket.proxyWith(socket);
        this.proxySockets.push(proxySocket);
        socket.on('disconnect', () => {
            _.remove(this.proxySockets, proxySocket);
            logger.debug(`A socket with id ${socket.id} disconnect. left ${this.proxySockets.length}`);
        });
    }
}

class ServerUtils {

}

module.exports = new SocketsRepository();
