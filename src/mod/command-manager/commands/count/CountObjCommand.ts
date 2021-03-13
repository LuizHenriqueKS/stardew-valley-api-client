import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
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
      await args.sendInfo('Contando objetos...');
      const location = await defaultParseNameLocation(args, 0);
      const lister = new ObjectInfoDao(args.client);
      lister.location = location;
      lister.acceptNames = args.commandArgs.length > 1 ? [args.commandArgs[1]] : [];
      const result = await lister.list();
      const items: any = {};
      const itemsLocation: any = {};
      for (const obj of result) {
        const name = `${obj.displayName}(${obj.name})`;
        if (items[name]) {
          items[name] += 1;
          itemsLocation[name][obj.location] = true;
        } else {
          items[name] = 1;
          itemsLocation[name] = [];
          itemsLocation[name][obj.location] = true;
        }
      }
      for (const key of Object.keys(items)) {
        const address = JSON.stringify(Object.keys(itemsLocation[key])).split('"').join('');
        args.sendInfo(`${key} ${address}: ${items[key]}`);
      }
      args.sendInfo(`Total objetos encontrados: ${result.length}`);
      console.log(result);
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }
}

export default new CountObjCommand();
