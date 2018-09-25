var Log = require('../tools/log');
var Handshake = require('./data/handshake');
var onData = require('./data');
var protocols = require('./protocols');
var createFrame = require('./data/createFrame');

class Socket {
  constructor(socket, wss) {
    this.wss = wss;
    this.netSocket = socket;
    this._handshakeDone = false;
    this.name = socket.remoteAddress + ":" + socket.remotePort;

    this._protocol = protocols.getDefaultProtocol();
    this._subProtocol = null;
    console.log('New Socket ' + this.name);
  }

  init() {
    this.netSocket.on('error', err => this.onError(err));
    this.netSocket.on('close', () => this.onClose());
    this.netSocket.on('timeout', () => this.onTimeout());
    this.netSocket.on('end', () => this.onEnd());
    this.netSocket.on('ready', () => this.onReady());
    this.netSocket.on('data', data => this.onData(data));
    this.netSocket.on('drain', () => console.log('connected'));
    this.netSocket.on('connect', () => console.log('connect'));

    this.netSocket.setKeepAlive(true);
    this.netSocket.setNoDelay(true);
  }

  _writePlain(data, callback) {
    this.netSocket.write(data, callback);
  }

  write(message, callback) {
    const frame = createFrame(Buffer.from(message), {
      fin: 1,
      rsv1: false,
      opcode: 1,
    });
    this._writePlain(frame[0], callback);
  }

  onData(data) {
    if (!this._handshakeDone) {
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
    this.netSocket.destroy();
  }
}

module.exports = Socket;
