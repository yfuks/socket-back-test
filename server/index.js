var net = require('net');
var EventEmitter = require('events');
var Socket = require('../socket');

const _defaultPort = 5000;
const _nativesEvents = [
  'close',
  'connection',
  'error',
  'listening',
];

class SocketServer {
  constructor(props) {
    props = props || {};
    this._clients = [];
    this._eventEmitter = new EventEmitter();
    this.netServer = net.createServer(ws => {
      const socket = new Socket(ws, this);
      this._clients.push(socket);

      socket.onRemoving = () => this.removeSocket(socket);
      socket.init();
    });

    this.netServer.listen({
      host: props.host || 'localhost',
      port: props.port || _defaultPort,
    });
  }

  removeSocket(socket) {
    const socketIndex = this._clients.indexOf(socket);
    if (socketIndex > -1) {
      this._clients.splice(socketIndex, 1);
    } else {
      console.warn('Trying to remove a socket who\'s not in the list');
    }
  }

  on(event, callback) {
    if (_nativesEvents.indexOf(event) > -1) {
      return this.netServer.on(event, callback);
    }
    this._eventEmitter.on(event, callback);
  }

  once(event, callback) {
    if (_nativesEvents.indexOf(event) > -1) {
      return this.netServer.once(event, callback);
    }
    this._eventEmitter.once(event, callback);
  }
}

module.exports = SocketServer;
