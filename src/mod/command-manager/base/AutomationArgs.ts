import APIClient from '@/src/api/APIClient';
import TileLocation from '@/src/api/model/TileLocation';
import Farmer from '@/src/api/proxy/Farmer';
import CommandManager from '../CommandManager';
import CommandArgs from './CommandArgs';

class AutomationArgs {
  commandManager!: CommandManager;
  client!: APIClient;
  player!: Farmer;
  args!: CommandArgs;
  tileLocation!: TileLocation;
}

export default AutomationArgs;
