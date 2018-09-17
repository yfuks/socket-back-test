var Log = require('../tools/log');

class Socket {
  constructor(socket) {
    this.socket = socket;
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

    this.socket.write("Welcome " + this.name + "\n");
    //broadcast(this.name + " joined the chat\n", this.socket);
    this.socket.setKeepAlive(true);
  }

  onData(data) {
    Log(this.name, data);
  }

  onError(error) {
    Log(this.name, error);
  }

  onClose() {
    //Log(this.name, 'close');
  }

  onTimeout() {
    Log(this.name, 'timeout');
    this.remove();
  }

  onEnd() {
    //Log(this.name, 'end');
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
