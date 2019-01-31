const io = require('socket.io-client');

// https://github.com/hden/socketio-wildcard
const patch = require('socketio-wildcard')(io.Manager);
const pretty = require('pretty-format');

class ProxySocket {
    constructor(clientSocket, serverSocket) {
        this.clientSocket = clientSocket;
        this.serverSocket = serverSocket;
        this.bind();
    }

    static proxyWith(clientSocket) {

        // const serverSocket = io(clientSocket.request.url)
        const serverSocket = io('http://localhost:3333', {
            query: {
                tk: clientSocket.handshake.tk
            }
        })
        patch(serverSocket);
        return new ProxySocket(clientSocket, serverSocket);
    }

    bind() {
        this.clientSocket.on('disconnect', () => {
            this.serverSocket.disconnect(true);
        });

        /**
         * TODO: how to mock server lost connection?
         * socket.disconnect() will make client not reuqest to server anymore.
         */
        this.serverSocket.on('disconnect', () => {

            // This should never happen: request from proxy to server should be stable.
            console.error('Holy shit');
            this.clientSocket.disconnect();
        });

        this.clientSocket.use((packet, next) => {
            console.log('Packet from client:');
            console.log(pretty(packet));
            this.serverSocket.emit(...packet);
            next();
        });

        this.serverSocket.on('*', (packet) => {
            console.log('Packet from server:');
            console.log(pretty(packet));
            this.clientSocket.emit(...packet.data);
        })
    }
}

module.exports = ProxySocket;
