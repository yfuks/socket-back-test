const JsonSubProtocol = require('./json');
const EventSubProtocol = require('./event');

const _ProtocolsList = [
  new JsonSubProtocol(),
  new EventSubProtocol(),
];

const subProtocols = {
  isProtocolSupported: (name) => {
    let isSupported = false;
    _ProtocolsList.forEach((p) => {
      if (p.name === name) {
        isSupported = true;
      }
    });
    return isSupported;
  },
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

module.exports = subProtocols;
