import Automation from './Automation';

class WaterPlantsAutomation extends Automation {
  async canActive(): Promise<boolean> {
    const toolName = await this.player.currentTool.getName();
    return toolName === 'Watering Can';
  }

  async start(): Promise<void> {
    this.log('Regação automática ativada.');
    this.bridge.game1.setMousePosition(0, 0);
    this.bridge.game1.setMouseCursorTransparency(0);
  }

  async stop(): Promise<void> {
    this.log('Regação automática desativa.');
    this.bridge.game1.setMouseCursorTransparency(1);
  }
}

export default WaterPlantsAutomation;
