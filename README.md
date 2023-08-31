# BunnyWS

[![npm](https://img.shields.io/npm/v/@jgtools/bunnyws)](https://www.npmjs.com/package/@jgtools/bunnyws)
[![npm](https://img.shields.io/npm/dm/@jgtools/bunnyws)](https://www.npmjs.com/package/@jgtools/bunnyws)
[![GitHub](https://img.shields.io/github/license/jgtools/bunnyws)](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)

Lightweight WebSocket library for Bun

## Features
- :rabbit: Works with Bun
- :zap: Zero dependencies
- :gear: Assigns an ID to each client connection
- :blue_square: Written in TypeScript

## Installation

### Using bun

```bash
bun a @jgtools/bunnyws
```

```javascript
import { BunnyWS } from "@jgtools/bunnyws";
// ...
```

## Usage

```typescript
import { BunnyMsg, BunnyWS, BunnyWSEvents, BunnyWSClient } from "@jgtools/bunnyws";

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
```

## Docs

### BunnyWS

`BunnyWS` is a WebSocket server.

Constructor parameters:
| Parameter | Type |
|-----------|------|
| `port` | `number` |
| `events` | `BunnyWSEvents` |

Methods:
| Method | Type |
|----------|------|
| `publish` | `(msg: string \| ArrayBufferView \| ArrayBuffer, compress?: boolean) => number` |

### BunnyWSEvents

`BunnyWSEvents` is an interface that defines the event handlers for a `BunnyWS` server.

| Property | Type |
|----------|------|
| `open` | `(ws: BunnyWSClient) => void` |
| `message` | `(ws: BunnyWSClient, msg: BunnyMsg) => void` |
| `close` | `(ws: BunnyWSClient) => void` |

## License

MIT
