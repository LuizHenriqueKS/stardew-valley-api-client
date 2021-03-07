import ChatMessageEvent from '@/src/api/event/ChatMessageEvent';
import CommandArgs from '../base/CommandArgs';
import CommandManager from '../CommandManager';
import { ZStr } from 'z-str';

function parseCommandArgs(manager: CommandManager, event: ChatMessageEvent): CommandArgs {
  const str = new ZStr(event.message, { ignoreErrors: true });
  const args = new CommandArgs();
  args.valid = str.startsWith('!');
  if (args.valid) {
    args.client = manager.client;
    args.commandName = str.from('!').till(' ').toString();
    if (str.containsAny(' ')) {
      args.commandArgsText = str.from(' ').toString();
      args.commandArgs = str.from(' ').toString().split(' ').filter(v => v !== '');
    } else {
      args.commandArgsText = '';
      args.commandArgs = [];
    }
    args.commandManager = manager;
    args.event = event;
    args.player = manager.client.bridge.game1.getFarmerById(event.sourceFarmer);
  }
  return args;
}

export default parseCommandArgs;
