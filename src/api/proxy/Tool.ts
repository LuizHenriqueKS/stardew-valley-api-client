import Ref from '../core/Ref';
import Item from './Item';

class Tool extends Item {
  sub(ref: Ref): Tool {
    return new Tool(ref);
  }

  async getWaterLeft(): Promise<number> {
    const script = `
      return ${this.ref.expression}.GetType().GetProperty('WaterLeft').GetValue(${this.ref.expression});
    `;
    return await this.ref.evaluate(script);
  }

  async getFishCaught(): Promise<boolean> {
    return await this.ref.evaluate(`return GameJS.OptValue(${this.ref.expression}, 'fishCaught');`);
  }
}

export default Tool;
