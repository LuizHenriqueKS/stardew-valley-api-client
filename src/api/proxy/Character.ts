import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import Item from './Item';
import Tool from './Tool';
import WalkingPath from './WalkingPath';
import Position from '../model/Position';
import TileLocation from '../model/TileLocation';
import WalkingPathFinder from './WalkingPathFinder';
import GameLocation from './GameLocation';

class Character extends Proxy<Character> {
  sub(ref: Ref): Character {
    return new Character(ref);
  }

  async findWalkingPathTo(endPoint: TileLocation, distance: number = 0, maxDirections = 10000): Promise<WalkingPath> {
    const finder = new WalkingPathFinder(this.ref.sub('WalkingPathFinder'));
    const startPoint = await this.getTileLocation();
    const paths = await finder.find({
      character: this,
      startPoint: startPoint,
      endPoint: endPoint,
      distance: distance,
      maxInteractions: maxDirections
    });
    return new WalkingPath(this, paths);
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

  async getGrabTile(): Promise<TileLocation> {
    const position = `${this.ref.expression}.GetGrabTile()`;
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

  get currentLocation(): GameLocation {
    return new GameLocation(this.ref.getChild('currentLocation'));
  }
}

export default Character;
