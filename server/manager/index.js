const _ = require('lodash');
const middleware = require('socketio-wildcard')();
const ProxySocket = require('../model/ProxySocket');
const logman = require('../logman');

class SocketsManager {
    constructor() {
        this.io = undefined;
        this.proxySockets = [];
        this.reqHandlers = [];
        this.respHandlers = [];
    }

    inject(io) {
        this.io = io;
        this.io.use(middleware);
        this.init();
    }

    init() {
        this.io.on('connection', (socket) => {
            this.register(socket);
        })
    }

    register(socket) {
        logman.logger.info(`A socket ${socket.id} connect. got ${this.proxySockets.length + 1}`);
        const proxySocket = ProxySocket.proxyWith(socket);
        this.proxySockets.push(proxySocket);
        socket.on('disconnect', () => {
            _.remove(this.proxySockets, proxySocket);
            logman.logger.info(`A socket with id ${socket.id} disconnect. left ${this.proxySockets.length}`);
        });

        this.intercept(proxySocket);
    }

    intercept(proxySocket) {
        proxySocket.processClientPacketWith(async (packet) => {
            return Promise.all(this.reqHandlers.map(h => h(proxySocket, packet)));
        });
        proxySocket.processServerPacketWith(async (packet) => {
            return Promise.all(this.respHandlers.map(h => h(proxySocket, packet)));
        });
    }

    /**
     * Handler type:
     * async(proxySocket, packet) => void
     */
    addReqHandler(h) {
        this.reqHandlers.push(h);
    }

    addRespHandler(h) {
        this.respHandlers.push(h);
    }

    use(logger) {
        logman.logger = logger;
    }
}

module.exports = new SocketsManager();
