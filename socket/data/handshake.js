const crypto = require('crypto');
const httpHeaders = require('http-headers');

const magicString = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const _isHandshake = (data) => {
  const header = httpHeaders(data);

  if (header.method !== 'GET' && header.method !== 'get')
    return false;
  if (!header.version || header.version.major < 1) {
    return false;
  } else if (header.version.major === 1 && header.version.minor < 1) {
    return false;
  }
  if (header.headers['sec-websocket-version'] !== '13') {
    return false;
  }
  return true;
};

const Handshake = (data, socket) => {
  if (!_isHandshake(data)) {
    return;
  }

  var secWebsocketKey = httpHeaders(data).headers['sec-websocket-key'];
  var hash = crypto.createHash('SHA1').update(secWebsocketKey + magicString).digest('base64');
  var handshake = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
          "Upgrade: websocket\r\n" +
          "Connection: Upgrade\r\n" +
          "Sec-WebSocket-Accept: " + hash + "\r\n" +
          "\r\n";
  socket.socket.write(handshake, () => {
    socket.handshakeDone = true;
  });
};

module.exports = Handshake;
