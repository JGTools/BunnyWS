# BunnyWS

[![npm](https://img.shields.io/npm/v/@jgtools/bunnyws)](https://www.npmjs.com/package/@jgtools/bunnyws)
[![npm](https://img.shields.io/npm/dm/@jgtools/bunnyws)](https://www.npmjs.com/package/@jgtools/bunnyws)
[![GitHub](https://img.shields.io/github/license/jgtools/bunnyws)](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)

Lightweight WebSocket library for Bun

## Features
- :rabbit: Works with Bun
- :zap: Zero dependencies
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
import { BunnyWS, BunnyWSClient, BunnyWSEvents } from "@jgtools/bunnyws";

const events: BunnyWSEvents = {
  open(ws: BunnyWSClient) {
    console.log("Client has connected", ws.data.id);
  },
  message(ws: BunnyWSClient, msg: string | Uint8Array) {
    console.log("Received:", msg);
    ws.send(msg);
    ws.data.broadcast(msg + ws.data.id);
  },
  close(ws: BunnyWSClient) {
    console.log("Client has disconnected:", ws.data.id);
  },
};

const bws = new BunnyWS(8080, events);
setInterval(() => bws.broadcast("Broadcast"), 3000);
setInterval(() => console.log(bws.clients.size), 5000);
```
## Docs

### BunnyWS

`BunnyWS` is a WebSocket server for bun.

| Property | Type |
|----------|------|
| `clients` | `Map<string, BunnyWSClient>` |
| `broadcast` | `(msg: string \| Uint8Array) => void` |

Constructor parameters:
| Parameter | Type |
|-----------|------|
| `port` | `number` |
| `events` | `BunnyWSEvents` |


### BunnyWSClient

`BunnyWSClient` is a `ServerWebSocket` and has the following additional properties:

| Property | Type |
|----------|------|
| `id`     | `string` |
| `broadcast` | `(msg: string \| Uint8Array) => void` |

### BunnyWSEvents

`BunnyWSEvents` is an interface that defines the event handlers for a `BunnyWS` server.

| Property | Type |
|----------|------|
| `open` | `(ws: BunnyWSClient) => void` |
| `message` | `(ws: BunnyWSClient, msg: string \| Uint8Array) => void` |
| `close` | `(ws: BunnyWSClient) => void` |

## License

MIT
