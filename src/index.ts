import { Server, ServerWebSocket } from "bun";

/** Interface that defines the event handlers for a BunnyWS server */
export interface BunnyWSEvents {
    open: (ws: ServerWebSocket) => void;
    message: (ws: ServerWebSocket, msg: string | ArrayBufferView | ArrayBuffer) => void;
    close: (ws: ServerWebSocket) => void;
}

/** WebSocket server*/
export class BunnyWS {
    private server: Server;

    /**
    * @param port - The port number to listen on
    * @param events - An object containing event handlers for the BunnyWS server
    */
    constructor(port: number, events: BunnyWSEvents) {
        this.server = Bun.serve({
            websocket: {
                open(ws: ServerWebSocket) {
                    ws.subscribe("global");
                    return events.open(ws);
                },
                message: events.message,
                close: events.close,
            },
            fetch(req: Request, server: Server) {
                if (!server.upgrade(req))
                    return new Response(null, { status: 404 });
            },
            port
        });
    }
    /** Publishes a message to all connected clients */
    publish(msg: string | ArrayBufferView | ArrayBuffer, compress?: boolean): number {
        return this.server.publish("global", msg, compress);
    }
}