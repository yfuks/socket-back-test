const Server = require('./server');

const PORT = process.env.SOCKET_PORT || 5000;
const wss = new Server({ port: PORT, host: 'localhost' });

wss.on('listening', () => console.log('Socket server running on', wss.netServer.address()));
wss.on('error', error => console.log('Server error', error));
wss.on('close', () => console.log('Server close'));

wss.on('one', (ws, body) => {
  console.log('new one event =>', body);
  ws.write(`hello user: ${body.userId}`);
});

wss.on('hello', (ws, body) => {
  console.log('new hello event =>', body);
  ws.write('hello client');
});
