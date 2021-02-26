import APIClient from '../APIClient';
import Response from '../model/Response';
import JSResponseNextOptions from '../model/JSResponseNextOptions';

class JSResponseReader {
  client: APIClient;
  id: number;

  constructor(client: APIClient, id: number) {
    this.client = client;
    this.id = id;
  }

  async optNext(): Promise<Response | null> {
    return await this.client.reader.nextById(this.id);
  }

  async next(options?: JSResponseNextOptions): Promise<Response> {
    const it = this;
    return new Promise(resolve => {
      let time = 0;
      const interval = options?.interval || 100;
      const readNext = () => {
        it.optNext().then(r => {
          if (r) {
            resolve(r);
          } else if (!options?.timeout || (options?.timeout && time < options.timeout)) {
            setTimeout(readNext, interval);
          }
        });
        time += interval;
      };
      readNext();
    });
  }
}

export default JSResponseReader;
