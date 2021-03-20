import TileLocation from '@/src/api/model/TileLocation';
import Localizable from './Localizable';

class ProximityIterator<T extends Localizable> {
  #items: T[];
  #currentTileLocationFunc: Promise<TileLocation>;

  constructor(currentTileLocationFunc: Promise<TileLocation>, items: T[]) {
    this.#items = [...items];
    this.#currentTileLocationFunc = currentTileLocationFunc;
  }

  hasNext(): boolean {
    return this.#items.length > 0;
  }

  async next(): Promise<T> {
    const currentTileLocation = await this.#currentTileLocationFunc;
    let index = 0;
    let indexDistance = this.calcDistance(currentTileLocation, await this.#items[index].getTileLocation());
    for (let i = 1; i < this.#items.length; i++) {
      const distance = this.calcDistance(currentTileLocation, await this.#items[i].getTileLocation());
      if (distance < indexDistance) {
        indexDistance = distance;
        index = i;
      }
    }
    const item = this.#items[index];
    this.#items.splice(index, 1);
    return item;
  }

  private calcDistance(a: TileLocation, b: TileLocation) {
    if (a.location !== b.location) {
      return 999999;
    } else {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  }
}

export default ProximityIterator;
