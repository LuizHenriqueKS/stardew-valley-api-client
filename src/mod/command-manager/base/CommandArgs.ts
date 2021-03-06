import APIClient from '@/src/api/APIClient';
import JSResponseReader from '@/src/api/core/JSResponseReader';
import ChatMessageEvent from '@/src/api/event/ChatMessageEvent';
import Farmer from '@/src/api/proxy/Farmer';
import CommandManager from '../CommandManager';
import moment from 'moment';

class CommandArgs {
  event?: ChatMessageEvent;
  commandManager!: CommandManager;
  client!: APIClient;
  player!: Farmer;
  commandName!: string;
  commandArgs!: string[];
  commandArgsText!: string;
  valid!: boolean;

  sendInfo(message: string): JSResponseReader {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');
    console.log(`[${datetime}] ApiBot: ${message}`);
    return this.client.bridge.game1.chatBox.addInfoMessage(message);
  }

  sendError(message: string): JSResponseReader {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');
    console.error(`[${datetime}] ApiBot: ${message}`);
    return this.client.bridge.game1.chatBox.addErrorMessage(message);
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
