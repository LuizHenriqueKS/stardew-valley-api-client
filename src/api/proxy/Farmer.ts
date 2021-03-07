import JSResponseReader from '../core/JSResponseReader';
import Character from './Character';

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

  async getStamina(): Promise<number> {
    return await this.ref.getPropertyValue('Stamina');
  }

  async isInventoryFull(): Promise<boolean> {
    return await this.ref.invokeMethodResult('isInventoryFull');
  }
}

export default Farmer;
