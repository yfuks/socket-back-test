const crypto = require('crypto');
const httpHeaders = require('http-headers');

const httpBadRequest = require('../constants/httpHeaders').badRequest;
const httpHanshake = require('../constants/httpHeaders').handshake;
const subProtocols = require('../subProtocols');

const magicString = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const _handshakeError = (header) => {
  if (header.method !== 'GET' && header.method !== 'get')
    return `Bad Request. Wrong method, use 'get' instead of ${header.method}`;
  if (!header.version || header.version.major < 1) {
    return 'Bad Request. http version not supported';
  } else if (header.version.major === 1 && header.version.minor < 1) {
    return 'Bad Request. http version not supported';
  }
  if (!header.headers['sec-websocket-version']) {
    return 'Bad Request. No sec-websocket-version specified';
  }
  if (header.headers['sec-websocket-version'] !== '13') {
    return `Bad Request. Websocket version '${header.headers['sec-websocket-version']}' not supported`;
  }
  return false;
};

const Handshake = (data, socket) => {
  const header = httpHeaders(data);
  var error;
  if ((error = _handshakeError(header))) {
    socket._writePlain(httpBadRequest(error));
    socket.remove();
    return;
  }

  const subProtocol = header.headers['sec-websocket-protocol'];
  if (subProtocol && subProtocols.isProtocolSupported(subProtocol)) {
    socket._subProtocol = subProtocols.getProtocolByName(subProtocol);
  }
  const secWebsocketKey = httpHeaders(data).headers['sec-websocket-key'];
  const hash = crypto.createHash('SHA1').update(secWebsocketKey + magicString).digest('base64');
  socket._writePlain(httpHanshake(hash), () => {
    socket._handshakeDone = true;
  });
};

module.exports = Handshake;
