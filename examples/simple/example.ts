import { BunnyMsg, BunnyWS, BunnyWSClient, BunnyWSEvents } from "@jgtools/bunnyws";

const events: BunnyWSEvents = {
    open: (ws: BunnyWSClient) => {
        console.log("Client has connected", ws.data.id);
    },
    message: (ws: BunnyWSClient, msg: BunnyMsg) => {
        console.log("Received:", msg);
        ws.send(msg); // send to client
        ws.publish("global", msg); // send to all connected clients (excluding itself)
    },
    close: (ws: BunnyWSClient) => {
        console.log("Client has disconnected:", ws.data.id);
    }
}

const bws = new BunnyWS(8080, events);
setInterval(() => bws.publish("Published to all"), 3000);