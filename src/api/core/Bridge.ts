import APIClient from '../APIClient';
import Game1 from '../proxy/Game1';
import ModHelper from '../proxy/ModHelper';
import Ref from './Ref';

class Bridge {
  #client: APIClient;
  #game1: Game1;
  #helper: ModHelper;

  constructor(client: APIClient) {
    this.#client = client;
    this.#game1 = new Game1(client);
    this.#helper = new ModHelper(new Ref(client, 'mod.Helper'));
  }

  get game1(): Game1 {
    return this.#game1;
  }

  get helper(): ModHelper {
    return this.#helper;
  }
}

export default Bridge;
