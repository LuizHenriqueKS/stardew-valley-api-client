import AutomationArgs from './AutomationArgs';
import CommandArgs from './CommandArgs';

interface Automation {
  name: string;

  validateStart(args: CommandArgs): Promise<void>;
  validateStep(args: AutomationArgs): Promise<void>

  execute(args: AutomationArgs): Promise<void>

}

export default Automation;
