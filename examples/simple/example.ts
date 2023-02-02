import { BunnyWS, BunnyWSClient, BunnyWSEvents } from "@jgtools/bunnyws";

const events: BunnyWSEvents = {
    open(ws: BunnyWSClient) {
        console.log("Client has connected", ws.data);
    },
    message(ws: BunnyWSClient, msg: string | ArrayBufferView | ArrayBuffer) {
        console.log("Received:", msg);
        ws.send(msg); // send to client
        ws.publish("global", msg); // send to all connected clients (including itself)
    },
    close(ws: BunnyWSClient) {
        console.log("Client has disconnected:", ws.data);
    }
}

const bws = new BunnyWS(8080, events);
setInterval(() => bws.publish("Published to all"), 3000);