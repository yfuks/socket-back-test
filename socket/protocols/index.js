const BinaryProtocol = require('./binary');
const TextProtocol = require('./text');

const _ProtocolsList = [
  new BinaryProtocol(),
  new TextProtocol(),
];

const Protocols = {
  getDefaultProtocol: () => new BinaryProtocol(),
  getProtocolByName: (name) => {
    let protocol;
    _ProtocolsList.forEach((p) => {
      if (p.name === name) {
        protocol = p;
      }
    });
    return protocol;
  },
};

module.exports = Protocols;
