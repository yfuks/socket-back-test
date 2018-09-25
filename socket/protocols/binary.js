class BinaryProtocol {
  constructor(props) {
    this.name = 'binary';
  }

  decodeData(data, payloadLength, startPoint) {
    const MASK = data.slice(startPoint, startPoint + 4);
    const ENCODED = data.slice(startPoint + 4, data.length);

    var DECODED = "";
    for (var i = 0; i < payloadLength; i++) {
      DECODED += ENCODED[i] ^ MASK[i % 4];
    }
    return DECODED;
  }
}

module.exports = BinaryProtocol;
