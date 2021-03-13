import ChestItemInfoDao from '@/src/api/dao/ChestItemInfoDao';
import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseNameLocation from '../../util/defaultParseNameLocation';

class CountChestCommand implements Command {
  name: string = 'Chest';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      await args.sendInfo('Contando itens de baú...');
      const location = await defaultParseNameLocation(args, 0);
      const lister = new ChestItemInfoDao(args.client);
      lister.location = location;
      lister.acceptNames = args.commandArgs.length > 1 ? [args.commandArgs[1]] : [];
      const result = await lister.list();
      const items: any = {};
      const stacks: any = {};
      const itemsLocation: any = {};
      for (const obj of result) {
        const name = `${obj.displayName}(${obj.name})`;
        if (items[name]) {
          items[name] += 1;
          stacks[name] += obj.stack;
        } else {
          items[name] = 1;
          itemsLocation[name] = {};
          stacks[name] = obj.stack;
        }
        itemsLocation[name][obj.location] = 1;
      }
      for (const key of Object.keys(items)) {
        const address = JSON.stringify(Object.keys(itemsLocation[key])).split('"').join('');
        args.sendInfo(`${key} ${address}: ${items[key]} (${stacks[key]})`);
      }
      args.sendInfo(`Total itens encontrados: ${result.length}`);
      console.log(result);
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }
}

export default new CountChestCommand();
