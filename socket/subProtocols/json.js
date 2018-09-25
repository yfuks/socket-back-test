class JsonSubProtocol {
  constructor(props) {
    this.name = 'json';
  }

  parseData(data) {
    return JSON.parse(data);
  }

  use(data) {
    console.log('new json data', data);
  }
}

module.exports = JsonSubProtocol;
