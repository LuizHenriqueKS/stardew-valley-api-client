import APISocket from './core/APISocket';
import JSRunner from './core/JSRunner';
import ClientReader from './core/ClientReader';

class APIClient {
  socket: APISocket;
  jsRunner: JSRunner;
  reader: ClientReader;

  constructor() {
    this.socket = new APISocket();
    this.jsRunner = new JSRunner(this);
    this.reader = new ClientReader(this);
  }

  async connect(host: string, port: number) {
    await this.socket.connect(host, port);
    this.reader.start();
  }

  async close() {
    await this.socket.close();
  }

  get connected(): boolean {
    return this.socket.connected;
  }
}

export default APIClient;
