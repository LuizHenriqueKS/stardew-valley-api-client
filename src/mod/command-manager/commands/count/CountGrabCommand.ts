import ObjectInfoLister from '@/src/api/lister/ObjectInfoLister';
import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseNameLocation from '../../util/defaultParseNameLocation';

class WalkGrabCommand implements Command {
  name: string = 'Grab';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      await args.sendInfo('Contando itens coletáveis...').next();
      const location = await defaultParseNameLocation(args, 0);
      const lister = new ObjectInfoLister(args.client);
      lister.location = location;
      lister.rejectNames = ['Weeds', 'Twig', 'Stone'];
      lister.rejectTypes = ['Crafting'];
      const result = await lister.list();
      const items: any = {};
      const itemsLocation: any = {};
      for (const obj of result) {
        const name = `${obj.displayName}(${obj.name})`;
        if (items[name]) {
          items[name] += 1;
        } else {
          items[name] = 1;
          itemsLocation[name] = {};
        }
        itemsLocation[name][obj.location] = 1;
      }
      for (const key of Object.keys(items)) {
        const address = JSON.stringify(Object.keys(itemsLocation[key])).split('"').join('');
        args.sendInfo(`${key} ${address}: ${items[key]}`);
      }
      args.sendInfo(`Total itens encontrados: ${result.length}`);
      console.log(result);
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }
}

export default new WalkGrabCommand();
