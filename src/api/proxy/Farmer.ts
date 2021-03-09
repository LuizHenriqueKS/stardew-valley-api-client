import JSResponseReader from '../core/JSResponseReader';
import WalkingEvent from '../event/WalkingEvent';
import TileLocation from '../model/TileLocation';
import Character from './Character';
import Item from './Item';

class Farmer extends Character {
  fish(till?: number): JSResponseReader {
    if (till) {
      const script = `GameJS.GetFisher(${this.ref.expression}).Start(request, ${till});`;
      return this.ref.client.jsRunner.run(script);
    } else {
      const script = `GameJS.GetFisher(${this.ref.expression}).Start(request);`;
      return this.ref.client.jsRunner.run(script);
    }
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

  setCurrentItemByName(name: string): JSResponseReader {
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
    return this.ref.client.jsRunner.run(script);
  }

  setCurrentItemByTypeName(name: string): JSResponseReader {
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
    return this.ref.client.jsRunner.run(script);
  }

  endUsingTool(): JSResponseReader {
    return this.ref.invokeMethod('EndUsingTool');
  }

  async walkTo(tileLocation: TileLocation, distance?: number): Promise<WalkingEvent> {
    const walkingPath = await this.findWalkingPathTo(tileLocation);
    return walkingPath.walk();
  }

  async pressLeftButton(release: boolean = true) {
    await this.ref.client.bridge.game1.input.pressLeftButton(release);
  }

  async releaseLeftButton() {
    await this.ref.client.bridge.game1.input.releaseLeftButton();
  }

  async pressRightButton() {
    await this.ref.client.bridge.game1.input.pressRightButton();
  }

  async pinMousePosition(x: number, y: number) {
    await this.ref.client.bridge.game1.input.simulateMousePosition(x, y).next();
  }

  async pinMousePositionAtTile(x: number, y: number) {
    await this.ref.client.bridge.game1.input.simulateMousePositionAtTile(x, y).next();
  }

  async releaseInputs() {
    await this.ref.client.bridge.game1.input.disableSimulations().next();
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
}

export default Farmer;
