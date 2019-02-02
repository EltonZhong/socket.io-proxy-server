const io = require('socket.io-client');
const patch = require('socketio-wildcard')(io.Manager);

const client = io('https://xmn02-i01-hbt01.lab.nordigy.ru');

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
    client.emit('a', 'asas')
    client.disconnect;
}, 1000)

setInterval(() => {
    client.connect;
}, 1000)

