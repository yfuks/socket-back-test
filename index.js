const Server = require('./server');

const PORT = process.env.SOCKET_PORT || 5000;
const wss = new Server({ port: 5000 });

wss.on('listening', () => console.log('Socket server running on', wss.netServer.address()));
wss.on('error', error => console.log('Server error', error));
wss.on('close', () => console.log('Server close'));
