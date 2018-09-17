const net = require('net');

const Log = require('./tools/log');
const Socket = require('./socket');

const PORT = process.env.SOCKET_PORT || 5000;

// Keep track of the clients
const clients = [];

const removeSocket = socket => {
  console.log('Removing: ' + socket.name);
  clients.splice(clients.indexOf(socket), 1);
};

const printClients = () => {
  console.log("\n-------------------------");
  console.log('Clients:');
  clients.map((client) => {
    console.log("- " + client.name);
  });
  console.log("-------------------------\n");
};

const socketServer = net.createServer(socket => {
  const sk = new Socket(socket);
  // Put this new client in the list
  clients.push(sk);

  // registersEvents
  sk.onRemoving = () => removeSocket(sk);
  sk.init();
});

socketServer.on('error', (err) => {
  console.log("Error on server");
  console.log(err);
});

socketServer.on('close', () => {
  console.log('Server close');
});

socketServer.on('listening', () => {
  console.log(`Socket server running at port: ${PORT}\n`);
});

socketServer.listen(PORT);
