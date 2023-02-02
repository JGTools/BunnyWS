import { ArrayBufferView, Server, ServerWebSocket } from "bun";

export type BunnyMsg = string | ArrayBufferView | ArrayBuffer;

/** ServerWebSocket with an addition property that stores clients id */
export type BunnyWSClient = ServerWebSocket<{ id: string }>;

/** Interface that defines the event handlers for a BunnyWS server */
export interface BunnyWSEvents {
    open: (ws: BunnyWSClient) => void;
    message: (ws: BunnyWSClient, msg: BunnyMsg) => void;
    close: (ws: BunnyWSClient) => void;
}

/** WebSocket server*/
export class BunnyWS {
    private server: Server;

    /**
    * @param port - The port number to listen on
    * @param events - An object containing event handlers
    */
    constructor(port: number, events: BunnyWSEvents) {
        this.server = Bun.serve({
            websocket: {
                open(ws: BunnyWSClient) {
                    ws.data.id = crypto.randomUUID();
                    ws.subscribe("global");
                    events.open(ws);
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
    publish(msg: BunnyMsg, compress?: boolean): number {
        return this.server.publish("global", msg, compress);
    }
}