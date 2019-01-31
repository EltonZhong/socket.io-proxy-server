const io = require('socket.io-client');
const patch = require('socketio-wildcard')(io.Manager);

const client = io('http://localhost:3000');
patch(client);

client.on('connect', () => {
    console.log('connect!');
});

client.on('disconnect', () => {
    console.log('disconnect!');
});

client.emit('hello', 'world', (resp) => {
    console.log('resp');
});

setInterval(() => {
    client.disconnect();
    console.log('disconn')
}, 1000)

setInterval(() => {
    client.connect();

client.emit('hello2', 'world', (resp) => {
    console.log('resp');
    console.log(resp);
});
}, 1000)
setInterval(() => {console.log(client.id)}, 1000)
client.on('*', function(a, b) {
    console.log('wildcard got')
    console.log(a, b)
    console.log(arguments);
})
client.on('do', () => {
    console.log('well');
})
