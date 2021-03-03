import APIClient from '@/src/api/APIClient';
import JSResponseReader from '@/src/api/core/JSResponseReader';
import ChatMessageEvent from '@/src/api/event/ChatMessageEvent';
import Farmer from '@/src/api/proxy/Farmer';
import CommandManager from '../CommandManager';

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
    return this.client.bridge.game1.chatBox.addInfoMessage(message);
  }

  sendError(message: string): JSResponseReader {
    return this.client.bridge.game1.chatBox.addErrorMessage(message);
  }
}

export default CommandArgs;
