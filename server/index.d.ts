import * as SocketIO from 'socket.io';
import * as SocketIOClient from 'socket.io-client';

declare function proxy(params: any) : SocketsManager;

export = proxy;

export interface ProxySocket {
    clientSocket: SocketIO.Socket;
    serverSocket: SocketIOClient.Socket;
    id: number;
}

export interface SocketsManager {
    proxySockets: [ProxySocket],
    io: SocketIO.Server;

    reqHandlers: [Handler];
    respHandlers: [Handler];

    addReqHandler(h: Handler) : void;
    addRespHandler(h: Handler) : void;
}

// Async handler
type Handler = (proxySocket: ProxySocket, packet: SocketIO.Packet) => Promise<void>;