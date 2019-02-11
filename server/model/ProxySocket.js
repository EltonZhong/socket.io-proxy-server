const io = require('socket.io-client');
const _ = require('lodash');

// https://github.com/hden/socketio-wildcard
const patch = require('socketio-wildcard')(io.Manager);
const pretty = require('pretty-format');
const { getLogger } = require('log4js');
const { SERVER } = require('../config');

const logger = getLogger('ProxySocket');
let id = 0;

class ProxySocket {
    constructor(clientSocket, serverSocket) {
        this.id = id ++;
        this.clientSocket = clientSocket;
        this.serverSocket = serverSocket;
        this.bind();
    }

    static proxyWith(clientSocket) {
        const clientQuery = clientSocket.handshake.query;
        const nativeProperties = ['EIO', 'transport', 't', 'b64'];
        const query = _.omit(clientQuery, nativeProperties);

        // Where data from client sockets really goes.
        const serverSocket = io(SERVER, {
            query,
            forceNew: true,
        });
        patch(serverSocket);
        const socket = new ProxySocket(clientSocket, serverSocket);
        socket.log(`Accept query from client: ${pretty(clientQuery)}`);
        socket.log(`Connect to server with query: ${pretty(query)}`);
        return socket;
    }

    bind() {
        this.clientSocket.on('disconnect', (reson) => {
            this.log(`Client ${this.clientSocket.id} disconnect:`)
            this.log(reson);

            this.log('Close server socket, due to the connection lost of client socket')
            this.serverSocket.disconnect(true);
        });

        /**
         * TODO: how to mock server lost connection?
         * socket.disconnect() will make client not reuqest to server anymore.
         */
        this.serverSocket.on('disconnect', (reson) => {

            // This is often triggered by [client socket connection disconnect]
            // Lost from server side should never happen: request from proxy to server should be stable.
            // When server connection lost, client socket will be closed, and client'll not connect initiative.
            this.log(`Socket with Server disconnect:`);
            this.log(reson);
            if (reson === 'io client disconnect') {
                return;
            }

            this.log('Close client socket, due to the connection lost of server socket')
            this.clientSocket.disconnect();
        });

        this.clientSocket.use((packet, next) => {
            this.log('Packet from client:');
            this.log(packet);
            this.serverSocket.emit(...packet);
            next();
        });

        this.serverSocket.on('*', (packet) => {
            this.log('Packet from server:');
            this.log(packet);
            this.clientSocket.emit(...packet.data);
        });

        this.serverSocket.on('connect', () => {
            this.log('Server socket connected');
        });
    }

    log() {
        logger.debug(...[this.id, ...arguments].map(i => typeof i === 'string' ? i : pretty(i)));
    }
}

module.exports = ProxySocket;
