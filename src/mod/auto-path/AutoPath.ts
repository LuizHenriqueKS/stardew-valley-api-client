import APIClient from '@/src/api/APIClient';
import Keys from '@/src/api/enums/Keys';
import TileLocation from '@/src/api/model/TileLocation';
import WalkingPath from '@/src/api/proxy/WalkingPath';

class AutoPath {
  #client: APIClient;
  #walking: boolean;
  #destination?: TileLocation;
  #path?: WalkingPath;

  constructor(client: APIClient) {
    this.#client = client;
    this.#walking = false;
  }

  async listen() {
    await this.listenButtonReleasedEvent();
  }

  async listenButtonReleasedEvent() {
    await this.#client.bridge.helper.events.input.buttonReleased.addListener(async (sender, args) => {
      if (args.button === Keys.VK_I) {
        await this.captureDestination();
      } else if (args.button === Keys.VK_O) {
        await this.goToDestination();
      } else if (args.button === Keys.VK_Q) {
        await this.desactive();
      }
    });
  }

  async captureDestination() {
    this.#destination = await this.#client.bridge.game1.player.getTileLocation();
    console.log('Novo destino salvo:', this.#destination);
    this.log('Novo destino salvo');
  }

  async goToDestination() {
    if (this.#destination) {
      this.#path = await this.#client.bridge.game1.player.findWalkPathTo(this.#destination!);
      this.#walking = true;
      this.log('Indo para o destino salvo...');
      await this.#path?.walk(async () => this.#walking);
      if (this.#path.finished) {
        this.finish();
      }
      this.desactive();
    } else {
      this.error('Destino não cadastrado');
    }
  }

  async desactive() {
    if (this.#walking) {
      this.#walking = false;
      if (this.#path) {
        this.#path.stop();
      }
    }
  }

  async finish() {
    this.desactive();
    this.log('Chegou no destino');
  }

  async log(message: string) {
    this.#client.bridge.game1.showGlobalMessage(message);
  }

  async error(message: string) {
    this.#client.bridge.game1.showRedMessage(message);
  }
}

export default AutoPath;
