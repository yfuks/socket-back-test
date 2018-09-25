const handshake = require('./handshake');
const Protocols = require('../protocols');
const httpBadRequest = require('../constants/httpHeaders').badRequest;
const sendPong = require('./pong');

const _getOpcode = data => {
  const buffer = Buffer.alloc(1, data.slice(0, 1), 'hex');
  var opcode = buffer.readUIntBE(0, 1);
  opcode &= 0x0F;

  return opcode;
};

const onData = (data, socket) => {
  const opcode = _getOpcode(data);

  switch (opcode) {
    case 0:
      //@TODO Continuation Frame
      break;
    case 1:
      socket._protocol = Protocols.getProtocolByName('text');
      break;
    case 2:
      socket._protocol = Protocols.getProtocolByName('binary');
      break;
    case 8:
      console.log('received close from client');
      socket.remove();
      return;
    case 9:
      console.log('received ping from client');
      //sendPong(data, socket);
      return;
    case 10:
      console.log('received pong from client');
      // ping
      break;
    default:
      break;
  }

  var bytesRead = 0;

  var buffer = Buffer.alloc(1, data.slice(1, 2), 'hex');
  var payloadLength = buffer.readUIntBE(0, 1);
  payloadLength &= ~(1 << 7);

  bytesRead += 2;

  if (payloadLength === 126) {
    buffer = Buffer.alloc(2, data.slice(2, 4), 'hex');
    payloadLength = buffer.readUIntBE(0, 2);
    bytesRead += 2;
  } else if (payloadLength === 127) {
    buffer = Buffer.alloc(8, data.slice(2, 10), 'hex');
    payloadLength = buffer.readUIntBE(0, 8);
    bytesRead += 8;
  }

  var DECODED = socket._protocol.decodeData(data, payloadLength, bytesRead);
  if (socket._subProtocol) {
    try {
      DECODED = socket._subProtocol.parseData(DECODED);
      socket._subProtocol.use(DECODED, socket);
    } catch (e) {
      console.warn(e.message);
    }
    return;
  }
  console.log(`opcode: ${opcode} len: ${payloadLength} decoded:`, DECODED);
};

module.exports = onData;
