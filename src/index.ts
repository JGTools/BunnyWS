import { Server, ServerWebSocket } from "bun";

/**
 * BunnyWSClient is a ServerWebSocket and has an additional property `id` of type string, and a method `broadcast` which sends a message to all connected clients.
 */
export type BunnyWSClient = ServerWebSocket<{
    id: string;
    broadcast: (msg: string | Uint8Array) => void;
}>;

/**
 * BunnyWSEvents is an interface that defines the event handlers for a BunnyWS server.
 */
export interface BunnyWSEvents {
    open: (ws: BunnyWSClient) => void;
    message: (ws: BunnyWSClient, msg: string | Uint8Array) => void;
    close: (ws: BunnyWSClient) => void;
}

/**
 * BunnyWS is a WebSocket server.
 *
 * Properties:
 * - `clients` is a Map of all connected clients, with the client id as the key and the BunnyWSClient as the value.
 * - `broadcast` is a method that takes a message of type string or Uint8Array and sends it to all connected clients.
 */
export class BunnyWS {
    clients = new Map<string, BunnyWSClient>();
    broadcast = (msg: string | Uint8Array) => {
        for (const ws of this.clients.values()) {
            ws.send(msg);
        }
    };
    /**
    * @param port - The port number to listen on.
    * @param events - An object containing event handlers for the BunnyWS server.
    */
    constructor(port: number, events: BunnyWSEvents) {
        const clients = this.clients;
        const broadcast = this.broadcast;
        Bun.serve({
            websocket: {
                open(ws: BunnyWSClient) {
                    ws.data = {
                        id: crypto.randomUUID(),
                        broadcast: broadcast
                    };
                    clients.set(ws.data.id, ws);

                    events.open(ws);
                },
                message(ws: BunnyWSClient, msg: string | Uint8Array) {
                    events.message(ws, msg);
                },
                close(ws: BunnyWSClient) {
                    clients.delete(ws.data.id);

                    events.close(ws);
                }
            },
            fetch(req: Request, server: Server) {
                if (!server.upgrade(req)) {
                    return new Response(null, { status: 404 });
                }
            },
            port
        });
    }
}