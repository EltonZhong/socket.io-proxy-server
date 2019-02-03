const io = require('socket.io-client');

// https://github.com/hden/socketio-wildcard
const patch = require('socketio-wildcard')(io.Manager);
const pretty = require('pretty-format');
const { getLogger } = require('log4js');

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
        const token = clientSocket.handshake.tk;

        // const serverSocket = io(clientSocket.request.url)
        const serverSocket = io('https://webaqaxmn.asialab.glip.net:443', {
            transports: ['polling', 'websocket'],
            autoConnect: false,
            reconnection: true,
            reconnectionDelay: 5000,
            reconnectionDelayMax: 25000,
            forceNew: true,
            query: { tk: token },
        });
        patch(serverSocket);
        const socket = new ProxySocket(clientSocket, serverSocket);
        socket.log(`Connect to server with token: ${token}`);
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
        logger.debug(...[this.id, ...arguments].map(pretty));
    }
}

module.exports = ProxySocket;
