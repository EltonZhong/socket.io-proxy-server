# socket.io-proxy-server
What a elegant way to proxy and intercept from socket.io connections!!!

inspired by [http-proxy](https://github.com/EltonZhong/koa-better-http-proxy)

## Usage:

### Using with Node http server
```js
process.env['SERVER'] = 'https://the_target_socket_io_server..';
const app = require('http').createServer(handler)
const proxy = require('socket.io-proxy-server')(app);
const manager = proxy(http);
manager.addReqHandler(
    async function(proxySocket, packet) {
        // Modify request here...
    }
);
manager.addReqHandler(
    async function(proxySocket, packet) {
        // Modify response here...
    }
);
```


### Or with koa:
```js
const Koa = require('koa');
const app = new Koa();
const http = require('http').createServer(app.callback());
const port = process.env.PORT || 3000;

const proxy = require('socket.io-proxy-server');
const manager = proxy(http);
manager.addReqHandler(
    async function(proxySocket, packet) {
        // Modify request here...
    }
);
manager.addReqHandler(
    async function(proxySocket, packet) {
        // Modify response here...
    }
);
```

