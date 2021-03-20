import FishingEvent from '../event/FishingEvent';
import WalkingEvent from '../event/WalkingEvent';
import ActionCanceledException from '../exception/ActionCanceledException';
import WalkingPathNotFoundException from '../exception/WalkingPathNotFoundException';
import TileLocation from '../model/TileLocation';
import WalkOptions from '../model/WalkOptions';
import sleep from '../util/sleep';
import Character from './Character';
import Item from './Item';
import Tool from './Tool';

class Farmer extends Character {
  async fish(till?: number): Promise<FishingEvent> {
    let script;
    if (till) {
      script = `GameJS.GetFisher(${this.ref.expression}).Start(request, ${till});`;
    } else {
      script = `GameJS.GetFisher(${this.ref.expression}).Start(request);`;
    }
    const reader = this.ref.client.jsRunner.run(script);
    await reader.next();
    const result: FishingEvent = (await reader.next()).result;
    return result;
  }

  async hasItemByName(name: string): Promise<boolean> {
    const script = `
      for (const item of ${this.ref.expression}.Items){
        if (item&&item.Name.toLowerCase()==='${name.toLocaleLowerCase()}'){
          return true;
        }
      }
      return false;
    `;
    return await this.ref.client.jsRunner.evaluate(script);
  }

  async hasItemByTypeName(name: string): Promise<boolean> {
    const script = `
      for (const item of ${this.ref.expression}.Items){
        if (item&&item.GetType().Name.toLowerCase()==='${name.toLocaleLowerCase()}'){
          return true;
        }
      }
      return false;
    `;
    return await this.ref.client.jsRunner.evaluate(script);
  }

  async setCurrentItemByName(name: string) {
    const script = `
      let itemIndex = 0;
      for (const item of ${this.ref.expression}.Items){
        if (item&&item.Name.toLowerCase()==='${name.toLocaleLowerCase()}'){
          ${this.ref.expression}.CurrentToolIndex = itemIndex;
          return true;
        }
        itemIndex++;
      }
      return false;
    `;
    await this.ref.client.jsRunner.run(script).next();
  }

  async setCurrentItemByTypeName(name: string) {
    const script = `
      let itemIndex = 0;
      for (const item of ${this.ref.expression}.Items){
        if (item&&item.GetType().Name.toLowerCase()==='${name.toLocaleLowerCase()}'){
          ${this.ref.expression}.CurrentToolIndex = itemIndex;
          return true;
        }
        itemIndex++;
      }
      return false;
    `;
    await this.ref.client.jsRunner.run(script).next();
    await sleep(100);
  }

  async beginUsingTool() {
    await this.ref.invokeMethod('BeginUsingTool').next();
  }

  async endUsingTool() {
    await this.ref.invokeMethod('EndUsingTool').next();
  }

  async walkTo(tileLocation: TileLocation, options?: WalkOptions): Promise<WalkingEvent> {
    const script = `
      const startPoint = new TileLocationModel(${this.ref.expression});
      const endPoint = new TileLocationModel('${tileLocation.location}', ${tileLocation.x}, ${tileLocation.y});
      const distance = ${options?.distance || 0};
      const walkingPath = WalkingPathFinder.Find(${this.ref.expression}, startPoint, endPoint, distance);
      if (walkingPath==null) return {walkingPathNotFound:true};
      GameJS.GetWalker(${this.ref.expression}).Walk(request, walkingPath.TileLocationList, ${options?.canFreeInputs || false});
      return { started: true };
    `;
    const reader = this.ref.run(script);
    while (true) {
      const response = await reader.next();
      const evt = response.result;
      if (evt.finished) {
        return evt;
      } else if (evt.canceled) {
        throw new ActionCanceledException();
      } else if (evt.walkingPathNotFound) {
        throw new WalkingPathNotFoundException();
      }
    }
  }

  async toolTo(endPoint: TileLocation) {
    const charPos = await this.getTileLocation();
    if (!this.isToolTileOn(charPos, endPoint)) {
      await this.tryWalkToolTo(endPoint);
      await this.pinMousePositionAtTile(endPoint.x, endPoint.y);
    }
  }

  private isToolTileOn(a: TileLocation, b: TileLocation): boolean {
    return a.x - 1 < b.x && b.x < a.x + 1 && a.y - 1 < b.y && b.y + 1 < a.y + 1;
  }

  private async tryWalkToolTo(tileLocation: TileLocation) {
    for (let x = tileLocation.x - 1; x <= tileLocation.x + 1; x++) {
      for (let y = tileLocation.y - 1; y <= tileLocation.y + 1; y++) {
        if (tileLocation.x !== x || tileLocation.y !== y) {
          if (await this.ref.client.bridge.game1.currentLocation.isTileLocationOpen(x, y)) {
            try {
              const neighbor = { x, y, location: tileLocation.location };
              await this.walkTo(neighbor);
              break;
            } catch (e) {
              if (!(e instanceof WalkingPathNotFoundException)) {
                throw e;
              }
            }
          }
        }
      }
    }
  }

  async pressLeftButton() {
    await this.ref.client.bridge.game1.input.pressLeftButton();
  }

  async releaseLeftButton() {
    await this.ref.client.bridge.game1.input.releaseLeftButton();
  }

  async clickLeftButton() {
    await this.ref.client.bridge.game1.input.clickLeftButton();
  }

  async pressRightButton() {
    await this.ref.client.bridge.game1.input.pressRightButton();
  }

  async releaseRightButton() {
    await this.ref.client.bridge.game1.input.pressRightButton();
  }

  async clickRightButton() {
    await this.ref.client.bridge.game1.input.clickRightButton();
  }

  async typeKey(key: number) {
    await this.ref.client.bridge.game1.input.typeKey(key);
  }

  async pinMousePosition(x: number, y: number) {
    await this.ref.client.bridge.game1.input.simulateMousePosition(x, y);
  }

  async pinMousePositionAtTile(x: number, y: number) {
    await this.ref.client.bridge.game1.input.simulateMousePositionAtTile(x, y);
  }

  async freeInputs() {
    await this.ref.client.bridge.game1.input.disableSimulations();
  }

  async getStamina(): Promise<number> {
    return await this.ref.getPropertyValue('Stamina');
  }

  async isInventoryFull(): Promise<boolean> {
    return await this.ref.invokeMethodResult('isInventoryFull');
  }

  get currentItem(): Item {
    return new Item(this.ref.getChild('CurrentItem'));
  }

  get currentTool(): Tool {
    return new Tool(this.ref.getChild('CurrentTool'));
  }
}

export default Farmer;
