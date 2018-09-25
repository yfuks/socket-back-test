const JsonSubProtocol = require('./json');

class EventSubProtocol extends JsonSubProtocol {
  constructor(props) {
    super(props);
    this.name = 'event';
  }

  use(data, socket) {
    const { event, body } = data;
    if (!event) {
      return;
    }
    socket.wss._eventEmitter.emit(event, socket, body);
  }
}

module.exports = EventSubProtocol;
