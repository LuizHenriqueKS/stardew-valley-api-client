import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import Direction from '../enums/Direction';
import Item from './Item';
import Tool from './Tool';
import WalkPath from './WalkPath';
import Position from '../model/Position';
import TileLocation from '../model/TileLocation';

class Character extends Proxy<Character> {
  sub(ref: Ref): Character {
    return new Character(ref);
  }

  async findWalkPathTo(destination: TileLocation, faceDirection = Direction.DOWN): Promise<WalkPath> {
    const refName = this.ref.newRefName();
    /* const script = `
      const character = ${this.ref.expression};
      const gameLocation = Game1.getLocationFromName('${destination.location}');
      const endPoint = new Point(${Math.round(destination.x)}, ${Math.round(destination.y)});
      const faceDirection = ${faceDirection};
      const refName = '${refName}';
      return new PathFindController(character, gameLocation, endPoint, faceDirection).pathToEndPoint;
    `; */
    const script = `
      const character = ${this.ref.expression};
      const location = Game1.getLocationFromName('${destination.location}');
      const startPoint = character.getTileLocationPoint();
      const endPoint = new Point(${Math.round(destination.x)}, ${Math.round(destination.y)});
      const refName = '${refName}';
      return GameJS.FindPath(character, location, startPoint, endPoint, 10000);
    `;
    const path = await this.ref.evaluate(script);
    return new WalkPath(this, path);
  }

  async listItems(): Promise<Item[]> {
    const length = await this.ref.getPropertyValue('items.Count');
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(new Item(this.ref.getChild(`items[${i}]`)));
    }
    return result;
  }

  async getCentralizeToolTile(): Promise<boolean> {
    return await this.ref.getPropertyValue('CentralizeToolTile');
  }

  setCentralizeToolTile(centralizeToolTile: boolean) {
    this.ref.setPropertyValue('CentralizeToolTile', centralizeToolTile);
  }

  async getPosition(): Promise<Position> {
    const position = `${this.ref.expression}.Position`;
    const location = `${this.ref.expression}.currentLocation.Name`;
    const values = await this.ref.evaluate(`return { x: ${position}.X, y: ${position}.Y, location: ${location} };`);
    return values;
  }

  async getTileLocation(): Promise<TileLocation> {
    const position = `${this.ref.expression}.getTileLocation()`;
    const location = `${this.ref.expression}.currentLocation.Name`;
    const values = await this.ref.evaluate(`return { x: ${position}.X, y: ${position}.Y, location: ${location} };`);
    return values;
  }

  async getFacingDirection(): Promise<number> {
    return await this.ref.getPropertyValue('FacingDirection');
  }

  setFacingDirection(facingDirection: number) {
    this.ref.setPropertyValue('FacingDirection', facingDirection);
  }

  get currentTool(): Tool {
    return new Tool(this.ref.getChild('CurrentTool'));
  }
}

export default Character;
