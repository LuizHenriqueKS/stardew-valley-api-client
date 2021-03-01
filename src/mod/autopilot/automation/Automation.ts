import APIClient from '@/src/api/APIClient';
import Bridge from '@/src/api/core/Bridge';
import Farmer from '@/src/api/proxy/Farmer';
import AutopilotMod from '../AutopilotMod';

abstract class Automation {
  #mod: AutopilotMod;

  constructor(mod: AutopilotMod) {
    this.#mod = mod;
  }

  abstract canActive(): Promise<boolean>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  log(message: string) {
    this.#mod.log(message);
  }

  get mod(): AutopilotMod {
    return this.#mod;
  }

  get client(): APIClient {
    return this.#mod.client;
  }

  get player(): Farmer {
    return this.bridge.game1.player;
  }

  get bridge(): Bridge {
    return this.client.bridge;
  }
}

export default Automation;
