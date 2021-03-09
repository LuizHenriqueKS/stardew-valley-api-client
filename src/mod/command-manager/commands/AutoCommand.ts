import TileLocation from '@/src/api/model/TileLocation';
import fs from 'fs';
import path from 'path';
import Automation from '../base/Automation';
import AutomationArgs from '../base/AutomationArgs';
import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import InvalidArgumentException from '../exception/InvalidArgumentException';
import InvalidArgumentsException from '../exception/InvalidArgumentsException';
import defaultCanExecute from '../util/defaultCanExecute';
import defaultHandleException from '../util/defaultHandleException';

class AutoCommand implements Command {
  name: string = 'Auto';
  automations: Automation[];
  canceled: boolean;

  constructor() {
    this.automations = [];
    this.canceled = false;
    this.loadAutomations();
  }

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      this.canceled = false;
      const localAutomations = this.listAutomationsByArgs(args);
      await this.startValidations(localAutomations, args);
      const tilesLocations = await this.listTilesLocations(args);
      for (const tileLocation of tilesLocations) {
        for (const automation of localAutomations) {
          if (!this.canceled) {
            const automationArgs = this.parseAutomationArgs(args, tileLocation);
            await automation.validateStep(automationArgs);
            await automation.execute(automationArgs);
          }
        }
      }
      args.sendInfo('Automação concluída');
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      args.client.bridge.game1.input.disableSimulations();
    }
  }

  private parseAutomationArgs(args: CommandArgs, tileLocation: TileLocation): AutomationArgs {
    const result = new AutomationArgs();
    result.commandManager = args.commandManager;
    result.client = args.client;
    result.player = args.player;
    result.args = args;
    result.tileLocation = tileLocation;
    return result;
  }

  private listAutomationsByArgs(args: CommandArgs): Automation[] {
    const result = [];
    const locationNames = [...args.commandArgs].slice(1).map(s => s.toLocaleLowerCase());
    for (const automation of this.automations) {
      if (locationNames.includes(automation.name.toLocaleLowerCase())) {
        result.push(automation);
      }
    }
    return result;
  }

  private async startValidations(automations: Automation[], args: CommandArgs) {
    for (const automation of automations) {
      await automation.validateStart(args);
    }
  }

  private async listTilesLocations(args: CommandArgs): Promise<TileLocation[]> {
    if (args.commandArgs.length === 0) {
      throw new InvalidArgumentsException();
    }
    const arg0 = args.commandArgs[0];
    const neighbor = parseInt(arg0);
    const center = await args.player.getTileLocation();
    const result: TileLocation[] = [];
    if (!isNaN(neighbor)) {
      for (let x = center.x - neighbor; x <= center.x + neighbor; x++) {
        for (let y = center.y - neighbor; y <= center.y + neighbor; y++) {
          if (center.x !== x || center.y !== y) {
            result.push({ x, y, location: center.location });
          }
        }
      }
      return result;
    } else {
      throw new InvalidArgumentException(arg0);
    }
  }

  private async loadAutomations() {
    const dir = path.join(__dirname, 'auto');
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      const automation: any = await import(filePath);
      this.automations.push(automation.default);
    }
  }
}

export default new AutoCommand();
