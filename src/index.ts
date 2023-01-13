import { Server, ServerWebSocket } from "bun";

/**
 * BunnyWSEvents is an interface that defines the event handlers for a BunnyWS server.
 */
export interface BunnyWSEvents {
    open: (ws: ServerWebSocket) => void;
    message: (ws: ServerWebSocket, msg: string | Uint8Array) => void;
    close: (ws: ServerWebSocket) => void;
}

/**
 * BunnyWS is a WebSocket server.
 *
 * Properties:
 * - `clients` is a Map of all connected clients, with the client id as the key and the BunnyWSClient as the value.
 * - `broadcast` is a method that takes a message of type string or Uint8Array and sends it to all connected clients.
 */
export class BunnyWS {
    /**
    * @param port - The port number to listen on.
    * @param events - An object containing event handlers for the BunnyWS server.
    */
    constructor(port: number, events: BunnyWSEvents) {
        Bun.serve({
            websocket: {
                open(ws: ServerWebSocket) {
                    ws.subscribe("room");
                    events.open(ws);
                },
                message(ws: ServerWebSocket, msg: string | Uint8Array) {
                    events.message(ws, msg);
                },
                close(ws: ServerWebSocket) {
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
    broadcast(ws: ServerWebSocket, msg: string | Uint8Array) {
        ws.publish("room", msg);
    }
}