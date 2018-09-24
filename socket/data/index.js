const handshake = require('./handshake');
const Log = require('../../tools/log');

const _toArrayBuffer = (buf) => {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

const onData = (data, socket) => {
  Log(socket.name + " row data > ", data);

  //const buff = Buffer.from(JSON.stringify(data));
  //const arrayBuff = _toArrayBuffer(buff);
  //console.log(buff);

  //const dataView = new DataView(arrayBuff, 48);
  //var buffer = new Buffer(data.slice(1, 2), 'hex');
  var buffer = Buffer.alloc(2, data.slice(1, 2), 'hex');
  var payloadLength = buffer.readUIntBE(0, 1);
  payloadLength &= ~(1 << 7);
  console.log('payloadLength:', payloadLength);
  //console.log(parseInt(len, 10));
  //len &= ~(0x8);
  //console.log(len);
  //var lenView = new DataView(arrayBuff, 16, 6);
  //var LENGTH = lenView.getUint8(0);
  //console.log(LENGTH);

  //@TODO if payloadLength >= 126

  var MASK = data.slice(2, 6); // 4, 8
  var ENCODED = data.slice(6, data.length);

  var DECODED = "";
  for (var i = 0; i < ENCODED.length; i++) {
    DECODED += String.fromCharCode(parseInt(ENCODED[i] ^ MASK[i % 4], 10));
  }
  console.log(`decoded: "${DECODED}"`);
};

module.exports = onData;
