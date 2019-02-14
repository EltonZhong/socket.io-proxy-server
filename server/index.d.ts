import * as SocketIO from 'socket.io';
import * as SocketIOClient from 'socket.io-client';

declare function proxy(params: any) : proxy.SocketsManager;

export = proxy;

declare namespace proxy {
    interface ProxySocket {
        clientSocket: SocketIO.Socket;
        serverSocket: SocketIOClient.Socket;
        id: number;
    }

    interface SocketsManager {
        proxySockets: [ProxySocket],
        io: SocketIO.Server;

        reqHandlers: [Handler];
        respHandlers: [Handler];

        addReqHandler(h: Handler) : void;
        addRespHandler(h: Handler) : void;
        use(logger: Logger) : void;
    }

    // Async handler
    type Handler = (proxySocket: ProxySocket, packet: WildCardPacket) => Promise<void>;

    interface Logger {
        info(...args: any): void
        debug(...args: any): void
    }

    interface WildCardPacket {
        nsp: string;
        type: string;
        data: SocketIO.Packet
    }
}
