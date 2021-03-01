import APISocket from './core/APISocket';
import JSRunner from './core/JSRunner';
import ClientReader from './core/ClientReader';
import Bridge from './core/Bridge';

class APIClient {
  #socket: APISocket;
  #jsRunner: JSRunner;
  #reader: ClientReader;
  #bridge: Bridge;

  #host: string;
  #port: number;

  constructor(host: string, port: number) {
    this.#host = host;
    this.#port = port;
    this.#socket = new APISocket(host, port);
    this.#jsRunner = new JSRunner(this);
    this.#reader = new ClientReader(this);
    this.#bridge = new Bridge(this);
  }

  async connect() {
    await this.#socket.connect();
    this.#reader.start();
  }

  async close() {
    await this.#socket.close();
  }

  get connected(): boolean {
    return this.#socket.connected;
  }

  get host(): string {
    return this.#host;
  }

  get port(): number {
    return this.#port;
  }

  get socket(): APISocket {
    return this.#socket;
  }

  get jsRunner(): JSRunner {
    return this.#jsRunner;
  }

  get reader(): ClientReader {
    return this.#reader;
  }

  get bridge(): Bridge {
    return this.#bridge;
  }
}

export default APIClient;
