const io = require('socket.io-client');

const client = io('http://localhost:65000');

let i = 0;
let j = 0;
client.on('connect', () => {
    console.log(`${i++} connect! ' + ${client.id}`);
});

client.on('disconnect', () => {
    console.log(`${j} disconnect! '`);
    console.log(`Remains ${i - j} connections`);
    j ++;
});

setInterval(() => {
    console.log(client.id + '\tdisconnect')
    client.disconnect();
}, 1000)

setInterval(() => {
    client.connect();
}, 1000)

