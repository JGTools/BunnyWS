import { Server, ServerWebSocket } from "bun";

export type BunnyWSClient = ServerWebSocket<{
    id: string;
    broadcast: (msg: string | Uint8Array) => void;
}>;

export interface BunnyWSEvents {
    open: (ws: BunnyWSClient) => void;
    message: (ws: BunnyWSClient, msg: string | Uint8Array) => void;
    close: (ws: BunnyWSClient) => void;
}

export default class BunnyWS {
    clients = new Map<string, BunnyWSClient>();
    broadcast = (msg: string | Uint8Array) => {
        for (const ws of this.clients.values()) {
            ws.send(msg);
        }
    };
    constructor(PORT: number, events: BunnyWSEvents) {
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
            port: PORT
        });
    }
}