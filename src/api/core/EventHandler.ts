import APIClient from '../APIClient';
import Proxy from './Proxy';
import ResponseType from '../enums/ResponseType';

class EventHandler<T> {
  #client: APIClient;
  #target: Proxy<any>;
  #eventName: string;
  #writeLog: boolean;

  constructor(target: Proxy<any>, eventName: string, writeLog = true) {
    this.#client = target.ref.client;
    this.#target = target;
    this.#eventName = eventName;
    this.#writeLog = writeLog;
  }

  async addListener(listener: (sender: object, args: T) => void): Promise<number> {
    const script = `return client.AddEvent(request, ${this.#target.ref.expression}, "${this.#eventName}", ${this.#writeLog}).Id;`;
    const reader = this.#target.ref.run(script);
    const listenerId = (await reader.next()).result;
    const listenEvent = () => {
      reader.next().then(evt => {
        if (evt.type === ResponseType.EVENT) {
          listener(evt.result.sender, evt.result.args);
        }
        listenEvent();
      });
    };
    listenEvent();
    return listenerId;
  }

  async removeListener(listenerId: number): Promise<boolean> {
    return await this.#target.ref.evaluate(`client.RemoveEvent(${listenerId})`);
  }
}

export default EventHandler;
