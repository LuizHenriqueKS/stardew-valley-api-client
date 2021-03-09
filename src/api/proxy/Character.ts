import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import Item from './Item';
import Tool from './Tool';
import WalkingPath from './WalkingPath';
import Position from '../model/Position';
import TileLocation from '../model/TileLocation';
import WalkingPathFinder from './WalkingPathFinder';
import GameLocation from './GameLocation';
import WalkingPathNotFoundException from '../exception/WalkingPathNotFoundException';
import ActionCanceledException from '../exception/ActionCanceledException';
import ItemInfo from '../model/ItemInfo';

class Character extends Proxy<Character> {
  sub(ref: Ref): Character {
    return new Character(ref);
  }

  async findWalkingPathTo(endPoint: TileLocation, distance: number = 0): Promise<WalkingPath> {
    const finder = new WalkingPathFinder(this);
    const pathResult = await finder.find({
      endPoint,
      distance
    });
    if (pathResult.finished && (!pathResult.data || pathResult.data.length === 0)) {
      throw new WalkingPathNotFoundException();
    } else if (pathResult.canceled) {
      throw new ActionCanceledException();
    }
    return new WalkingPath(this, pathResult.data);
  }

  async listItems(): Promise<Item[]> {
    const length = await this.ref.getPropertyValue('items.Count');
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(new Item(this.ref.getChild(`items[${i}]`)));
    }
    return result;
  }

  async listItemsInfos(): Promise<ItemInfo[]> {
    const script = `
      const result = [];
      let index = 0;
      for (const item of ${this.ref.expression}.items){
        if (item) {
          result.push({name: item.Name, displayName: item.DisplayName, index});
        }
        index++;
      }
      return result;
    `;
    const response = await this.ref.client.jsRunner.run(script).next();
    return response.result;
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

  async nextPositionTile(): Promise<TileLocation> {
    const script = `
      const direction = ${this.ref.expression}.FacingDirection;
      const position = ${this.ref.expression}.getTileLocation();
      let x = 0;
      let y = 0;
      switch (direction){
        case 0:
          y--;
          break;
        case 1:
          x++;
          break;
        case 2:
          y++;
          break;
        case 3:
          x--;
          break;
      }
      return {x: x+position.X, y: y+position.Y, location: ${this.ref.expression}.currentLocation.Name, direction: direction};
    `;
    const values = await this.ref.evaluate(script);
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
