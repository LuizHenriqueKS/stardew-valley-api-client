import Ref from '../core/Ref';
import Item from './Item';

class Tool extends Item {
  sub(ref: Ref): Tool {
    return new Tool(ref);
  }

  async getWaterLeft(): Promise<number> {
    return await this.ref.optValue('WaterLeft');
  }

  async getFishCaught(): Promise<boolean> {
    return await this.ref.optValue('fishCaught');
  }

  async getTreasureCaught(): Promise<boolean> {
    return await this.ref.optValue('treasureCaught');
  }
}

export default Tool;
