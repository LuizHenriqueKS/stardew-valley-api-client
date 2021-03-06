import APIClient from '../APIClient';
import Game1 from '../proxy/Game1';
import ModHelper from '../proxy/ModHelper';
import SaveGame from '../proxy/SaveGame';
import WalkingPathFinder from '../proxy/WalkingPathFinder';
import Ref from './Ref';

class Bridge {
  #client: APIClient;
  #game1: Game1;
  #saveGame: SaveGame;
  #helper: ModHelper;
  #walkingPathFinder: WalkingPathFinder;

  constructor(client: APIClient) {
    this.#client = client;
    this.#game1 = new Game1(client);
    this.#saveGame = new SaveGame(new Ref(client, 'SaveGame'));
    this.#helper = new ModHelper(new Ref(client, 'mod.Helper'));
    this.#walkingPathFinder = new WalkingPathFinder(new Ref(client, 'WalkingPathFinder'));
  }

  get game1(): Game1 {
    return this.#game1;
  }

  get helper(): ModHelper {
    return this.#helper;
  }

  get saveGame(): SaveGame {
    return this.#saveGame;
  }

  get walkingPathFinder(): WalkingPathFinder {
    return this.#walkingPathFinder;
  }
}

export default Bridge;
