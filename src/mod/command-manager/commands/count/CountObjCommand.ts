import ObjectInfoLister from '@/src/api/lister/ObjectInfoLister';
import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseNameLocation from '../../util/defaultParseNameLocation';

class CountObjCommand implements Command {
  name: string = 'Obj';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      await args.sendInfo('Contando objetos...').next();
      const location = await defaultParseNameLocation(args, 0);
      const lister = new ObjectInfoLister(args.client);
      lister.location = location;
      lister.acceptNames = args.commandArgs.length > 1 ? [args.commandArgs[1]] : [];
      const result = await lister.list();
      const items: any = {};
      const itemsLocation: any = {};
      for (const obj of result) {
        const name = `${obj.displayName}(${obj.name})`;
        if (items[name]) {
          items[name] += 1;
          itemsLocation[name].push(obj.location);
        } else {
          items[name] = 1;
          itemsLocation[name] = [obj.location];
        }
      }
      for (const key of Object.keys(items)) {
        const address = JSON.stringify(itemsLocation).split("'").join('');
        args.sendInfo(`${key} [${address}]: ${items[key]}`);
      }
      args.sendInfo(`Total objetos encontrados: ${result.length}`);
      console.log(result);
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }
}

export default new CountObjCommand();