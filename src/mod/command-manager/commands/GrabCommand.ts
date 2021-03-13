import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';
import TileLocation from '@/src/api/model/TileLocation';
import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import defaultHandleException from '../util/defaultHandleException';
import listGrabbableObjects from '../util/listGrabbableObject';

class GrabCommand implements Command {
  name: string = 'Grab';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      args.sendInfo('Localizando itens coletáveis...');
      const result = await listGrabbableObjects(args, 0);
      if (result.find(obj => obj.name === 'Artifact Spot')) {
        await args.requireTool('Hoe');
      }
      let i = 0;
      for (const obj of result) {
        try {
          await args.requireInventorySpace();
          i++;
          args.sendInfo(`Calculando rota até ${obj.displayName} [${i}/${result.length}]...`);
          const endPoint: TileLocation = {
            x: obj.x,
            y: obj.y,
            location: obj.location
          };
          const walkingPath = await args.player.findWalkingPathTo(endPoint, 1);
          args.sendInfo(`Indo até ${obj.displayName}...`);
          await walkingPath.walk();
          await args.client.bridge.game1.input.simulateMousePositionAtTile(endPoint.x, endPoint.y);
          if (obj.name === 'Artifact Spot') {
            await args.player.setCurrentItemByTypeName('Hoe');
          }
          await args.client.bridge.game1.input.clickLeftButton();
          if (obj.name === 'Artifact Spot') {
            await args.player.walkTo(endPoint);
          }
        } catch (e) {
          if (!(e instanceof WalkingPathNotFoundException)) {
            throw e;
          }
        }
      }
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }
}

export default new GrabCommand();
