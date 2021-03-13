import JSResponseReader from '../core/JSResponseReader';
import FishingEvent from '../event/FishingEvent';
import WalkingEvent from '../event/WalkingEvent';
import TileLocation from '../model/TileLocation';
import WalkOptions from '../model/WalkOptions';
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
  }

  async beginUsingTool() {
    await this.ref.invokeMethod('BeginUsingTool');
  }

  async endUsingTool() {
    await this.ref.invokeMethod('EndUsingTool');
  }

  async walkTo(tileLocation: TileLocation, options?: WalkOptions): Promise<WalkingEvent> {
    const walkingPath = await this.findWalkingPathTo(tileLocation, options?.distance);
    return walkingPath.walk(undefined, options?.canResetInputs);
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
