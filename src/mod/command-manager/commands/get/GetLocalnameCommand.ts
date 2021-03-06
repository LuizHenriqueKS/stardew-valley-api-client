import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';

class GetLocalnameCommand implements Command {
  name: string = 'Localname';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    const localName = await args.player.ref.getPropertyValue('currentLocation.Name');
    args.sendInfo(`Nome do local atual: ${localName}`);
  }
}

export default new GetLocalnameCommand();
