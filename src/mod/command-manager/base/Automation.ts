import TileLocation from '@/src/api/model/TileLocation';
import AutomationArgs from './AutomationArgs';
import CommandArgs from './CommandArgs';

interface Automation {

  name: string;

  validateStart(args: CommandArgs): Promise<void>;
  validateStep(args: AutomationArgs): Promise<void>;

  execute(args: AutomationArgs): Promise<void>;

  list(args: CommandArgs): Promise<TileLocation[]>;
  canExecute(args: AutomationArgs): Promise<boolean>;

}

export default Automation;
