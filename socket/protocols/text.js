class TextProtocol {
  constructor(props) {
    this.name = 'text';
  }

  decodeData(data, payloadLength, startPoint) {
    const MASK = data.slice(startPoint, startPoint + 4);
    const ENCODED = data.slice(startPoint + 4, data.length);

    var DECODED = "";
    for (var i = 0; i < payloadLength; i++) {
      DECODED += String.fromCharCode(parseInt(ENCODED[i] ^ MASK[i % 4], 10));
    }
    return DECODED;
  }
}

module.exports = TextProtocol;
