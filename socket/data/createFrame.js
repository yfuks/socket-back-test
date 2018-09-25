const crypto = require('crypto');

const createFrame = (data, options) => {
  const merge = data.length < 1024;
  var offset = 2;
  var payloadLength = data.length;

  if (data.length >= 65536) {
    offset += 8;
    payloadLength = 127;
  } else if (data.length > 125) {
    offset += 2;
    payloadLength = 126;
  }

  const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

  target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
  if (options.rsv1) {
    target[0] |= 0x40;
  }

  if (payloadLength === 126) {
    target.writeUInt16BE(data.length, 2);
  } else if (payloadLength === 127) {
    target.writeUInt32BE(0, 2);
    target.writeUInt32BE(data.length, 6);
  }

  target[1] = payloadLength;
  if (merge) {
    data.copy(target, offset);
    return [target];
  }

  return [target, data];
};

module.exports = createFrame;
