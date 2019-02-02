const io = require('socket.io-client');
const patch = require('socketio-wildcard')(io.Manager);

const client = io('https://xmn02-i01-hbt01.lab.nordigy.ru?tk=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ0b2tlbl9pZCI6MTU0NzAxNDMwMzU0MiwidHlwZSI6IndlYiIsInVpZCI6MjM4NDAzNTg3LCJpYXQiOjE1NDcwMTQzMDMsImlzcyI6IndlYmFxYXhtbi5hc2lhbGFiLmdsaXAubmV0Iiwic3ViIjoiZ2xpcCJ9.4rhB9y3ovVv9tK9ji-r4PZZaV5mFUC59kS2KygwNea1-79v6Bccp5PHkD-oJE6BmZUaoXRfu9KR7dcWRZM9dxg');

patch(client);

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
client.on('*', function() {
    console.log(arguments);
})

setInterval(() => {
    console.log('emiit');
    // client.emit('a', 'asas')
    client.disconnect;
}, 1000)

setInterval(() => {
    client.connect;
}, 1000)

