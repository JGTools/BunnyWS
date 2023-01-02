import BunnyWS, { BunnyWSClient, BunnyWSEvents } from "../../src";

const events: BunnyWSEvents = {
    open(ws: BunnyWSClient) {
        console.log("Client has connected");
        console.log("Echoing: %s", ws.data.id);
    },
    message(ws: BunnyWSClient, msg: string | Uint8Array) {
        console.log("Echoing: %s", msg);
        ws.send(msg);
        ws.data.broadcast(msg + ws.data.id);
    },
    close(ws: BunnyWSClient) {
        console.log("Client has disconnected");
    }
}

const bws = new BunnyWS(8080, events);
setInterval(() => {
    console.log("clients", bws.clients.size);
    bws.broadcast("Broadcast")
}, 3000);