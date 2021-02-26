import APIClient from '../APIClient';
import JSResponseReader from './JSResponseReader';

class JSRunner {
  client: APIClient;
  #lastId: number;

  constructor(client: APIClient) {
    this.client = client;
    this.#lastId = 0;
  }

  async run(script: string): Promise<JSResponseReader> {
    const id = this.#lastId++;
    await this.client.socket.sendJSON({
      id,
      command: {
        name: 'RunJS',
        args: {
          script
        }
      }
    });
    return new JSResponseReader(this.client, id);
  }
}

export default JSRunner;
