import { BunnyWS, BunnyWSEvents } from "@jgtools/bunnyws";
import { ServerWebSocket } from "bun";

const events: BunnyWSEvents = {
    open(ws: ServerWebSocket) {
        console.log("Client has connected", ws.data);
    },
    message(ws: ServerWebSocket, msg: string | ArrayBufferView | ArrayBuffer) {
        console.log("Received:", msg);
        ws.send(msg); // send to client
        ws.publish("global", msg); // send to all connected clients (including itself)
    },
    close(ws: ServerWebSocket) {
        console.log("Client has disconnected:", ws.data);
    }
}

const bws = new BunnyWS(8080, events);
setInterval(() => bws.publish("Published to all"), 3000);