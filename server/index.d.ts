import * as SocketIO from 'socket.io';
import * as SocketIOClient from 'socket.io-client';

declare function proxy(params: any) : SocketsRepository;

export = proxy;

interface ProxySocket {
    clientSocket: SocketIO.Socket;
    serverSocket: SocketIOClient.Socket;
    id: number;
}

declare interface SocketsRepository {
    proxySockets: [ProxySocket],
    io: SocketIO.Server;
}