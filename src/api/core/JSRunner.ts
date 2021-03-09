import APIClient from '../APIClient';
import JSResponseReader from './JSResponseReader';

class JSRunner {
  client: APIClient;
  lastRefId: number;
  #lastRequestId: number;

  constructor(client: APIClient) {
    this.client = client;
    this.lastRefId = 0;
    this.#lastRequestId = 0;
  }

  run(script: string): JSResponseReader {
    const id = this.#lastRequestId++;
    this.client.socket.sendJSON({
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

  async evaluate(script: string): Promise<any> {
    const reader = this.run(script);
    const response = await reader.next();
    return response.result;
  }
}

export default JSRunner;
