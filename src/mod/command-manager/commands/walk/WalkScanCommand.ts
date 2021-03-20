import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import ResponseType from '@/src/api/enums/ResponseType';
import InvalidArgumentException from '../../exception/InvalidArgumentException';

class WalkScanCommand implements Command {
  name: string = 'Scan';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      if (args.commandArgs.length === 0) {
        throw new InvalidArgumentException('Sem argumentos');
      } else if (args.commandArgs[0].toLocaleLowerCase() === 'all') {
        await this.scanAll(args);
      } else if (args.commandArgs[0].toLocaleLowerCase() === 'here') {
        await this.scanHere(args);
      } else {
        throw new InvalidArgumentException(`Argumento inválido: ${args.commandArgs[0]}`);
      }
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }

  async scanAll(args: CommandArgs) {
    await args.sendInfo('Iniciando escaneamento...');
    const script = `
        GameJS.GetPathMap().Clear();
        GameJS.GetPathMap().Scan(request);
      `;
    const reader = args.client.jsRunner.run(script);
    await reader.next();
    let lastEvent;
    do {
      lastEvent = await reader.next();
      const result = lastEvent.result;
      if (result && result.currentProgress) {
        // await args.sendInfo(`Progresso do escaneamento ${result.currentProgress}/${result.maxProgress}...`);
      }
    } while (lastEvent.type === ResponseType.PROGRESS);
    args.sendInfo('Escaneamento concluído.');
  }

  async scanHere(args: CommandArgs) {
    const location = await args.player.currentLocation.getName();
    await args.sendInfo(`Escaneando ${location}...`);
    const script = `
        GameJS.GetPathMap().AddPathsFromLocation('${location}');
        GameJS.GetPathMap().Save();
      `;
    await args.client.jsRunner.run(script).next();
    args.sendInfo('Escaneamento concluído.');
  }
}

export default new WalkScanCommand();
