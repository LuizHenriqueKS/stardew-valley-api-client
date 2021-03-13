import APIClient from '@/src/api/APIClient';
import ChatMessageEvent from '@/src/api/event/ChatMessageEvent';
import Farmer from '@/src/api/proxy/Farmer';
import CommandManager from '../CommandManager';
import moment from 'moment';
import InsufficientStaminaException from '../exception/InsufficientStaminaException';
import FullInventoryException from '../exception/FullInventoryException';
import ToolNotFoundException from '../exception/ToolNotFoundException';

class CommandArgs {
  event?: ChatMessageEvent;
  commandManager!: CommandManager;
  client!: APIClient;
  player!: Farmer;
  commandName!: string;
  commandArgs!: string[];
  commandArgsText!: string;
  valid!: boolean;

  async sendInfo(message: string) {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');
    console.log(`[${datetime}] ApiBot: ${message}`);
    await this.client.bridge.game1.chatBox.addInfoMessage(message);
  }

  async sendError(message: string) {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');
    console.error(`[${datetime}] ApiBot: ${message}`);
    await this.client.bridge.game1.chatBox.addErrorMessage(message);
  }

  async requireStamina() {
    const stamina = await this.client.bridge.game1.player.getStamina();
    if (stamina < 0) {
      throw new InsufficientStaminaException();
    }
  }

  async requireInventorySpace() {
    if (await this.player.isInventoryFull()) {
      throw new FullInventoryException();
    }
  }

  async requireTool(name: string) {
    const byName = await this.player.hasItemByName(name);
    const byTypeName = await this.player.hasItemByTypeName(name);
    if (!byName && !byTypeName) {
      throw new ToolNotFoundException(name);
    }
  }

  clone(): CommandArgs {
    const result = new CommandArgs();
    result.event = this.event;
    result.commandManager = this.commandManager;
    result.client = this.client;
    result.player = this.player;
    result.commandName = this.commandName;
    result.commandArgs = this.commandArgs;
    result.commandArgsText = this.commandArgsText;
    result.valid = this.valid;
    return result;
  }
}

export default CommandArgs;
