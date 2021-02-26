import APIClient from '../APIClient';
import Response from '../model/Response';

class ClientReader {
  client: APIClient;
  responses: Response[];

  constructor(client: APIClient) {
    this.client = client;
    this.responses = [];
  }

  start() {
    const it = this;
    const readNext = function () {
      it.client.socket.readJSON().then(response => {
        it.responses.push(response);
        if (it.client.connected) {
          readNext();
        }
      });
    };
    readNext();
  }

  async next(predicate: (r: Response) => boolean): Promise<Response | null> {
    return new Promise(resolve => {
      const index = this.responses.findIndex(predicate);
      if (index > -1) {
        const response = this.responses[index];
        this.responses.splice(index, 1);
        resolve(response);
      } else {
        resolve(null);
      }
    });
  }

  async nextById(id: number): Promise<Response | null> {
    return await this.next(r => r.id === id);
  }
}

export default ClientReader;
