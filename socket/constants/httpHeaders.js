const httpHeaders = {
  badRequest: error => {
    return (
      "HTTP/1.1 400 Bad Request\r\n" +
      "Sec-WebSocket-Version: 13\r\n\r\n" +
      error +
      "\r\n"
    );
  },
  handshake: hash => {
    return (
      "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      "Sec-WebSocket-Accept: " + hash + "\r\n" +
      "\r\n"
    );
  },
};

module.exports = httpHeaders;
