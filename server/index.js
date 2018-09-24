var net = require('net');
var Socket = require('../socket');

const _defaultPort = 5000;

class SocketServer {
  constructor(props) {
    props = props || {};
    this.clients = [];
    this.netServer = net.createServer(ws => {
      const socket = new Socket(ws);
      this.clients.push(socket);

      socket.onRemoving = () => this.removeSocket(socket);
      socket.init();
    });

    this.netServer.listen({
      host: 'localhost',
      port: props.port || _defaultPort,
    });
  }

  removeSocket(socket) {
    const socketIndex = this.clients.indexOf(socket);
    if (socketIndex > -1) {
      this.clients.splice(socketIndex, 1);
    } else {
      console.warn('Trying to remove a socket who\'s not in the list');
    }
  }

  on(event, callback) {
    this.netServer.on(event, callback);
  }
}

module.exports = SocketServer;
