import AutopilotMod from '../AutopilotMod';
import Automation from './Automation';
import WaterPlantsAutomation from './WaterPlantsAutomation';

class Automations {
  listAutomations(mod: AutopilotMod): Automation[] {
    return [
      new WaterPlantsAutomation(mod)
    ];
  }
}

export default new Automations();
