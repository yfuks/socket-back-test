var Log = require('../tools/log');
var Handshake = require('./data/handshake');
var onData = require('./data');

class Socket {
  constructor(socket) {
    this.socket = socket;
    this.handshakeDone = false;
    this.name = socket.remoteAddress + ":" + socket.remotePort;

    console.log('New Socket ' + this.name);
  }

  init() {
    this.socket.on('error', err => this.onError(err));
    this.socket.on('close', () => this.onClose());
    this.socket.on('timeout', () => this.onTimeout());
    this.socket.on('end', () => this.onEnd());
    this.socket.on('ready', () => this.onReady());
    this.socket.on('data', data => this.onData(data));
    this.socket.on('drain', () => console.log('connected'));
    this.socket.on('connect', () => console.log('connect'));

    this.socket.setKeepAlive(true);
  }

  onData(data) {
    if (!this.handshakeDone) {
      Handshake(data, this);
      return ;
    }

    onData(data, this);
  }

  onError(error) {
    Log(this.name, error);
  }

  onClose() {
    Log(this.name, 'close');
  }

  onTimeout() {
    Log(this.name, 'timeout');
    this.remove();
  }

  onEnd() {
    Log(this.name, 'end');
    this.remove();
  }

  onReady() {
    Log(this.name, 'ready');
  }

  remove() {
    this.onRemoving();
    this.socket.destroy();
  }
}

module.exports = Socket;
