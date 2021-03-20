import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
import TerrainFeatureInfoDao from '@/src/api/dao/TerrainFeatureInfoDao';
import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import defaultHandleException from '../util/defaultHandleException';

class CutCommand implements Command {
  name: string = 'Cut';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      await args.player.pinMousePosition(0, 0);
      await this.cutTree(args);
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }

  async validate(args: CommandArgs) {
    await args.requireTool('Axe');
    await args.requireInventorySpace();
    await args.requireStamina();
  }

  async cutTree(args: CommandArgs) {
    await this.validate(args);
    await args.player.setCurrentItemByTypeName('Axe');
    const toolTileLocation = await args.player.nextPositionTile();
    args.sendInfo(`Cortando a árvore em ${toolTileLocation.x}, ${toolTileLocation.y}...`);
    let treeFound = false;
    while (true) {
      const tree = await new TerrainFeatureInfoDao(args.client).get(toolTileLocation);
      const obj = await new ObjectInfoDao(args.client).get(toolTileLocation);
      if (obj && obj.name === 'Twig') {
        await args.player.pressLeftButton();
        treeFound = true;
        break;
      } else if (tree && tree.health > 0) {
        await args.player.pressLeftButton();
        treeFound = true;
      } else {
        await args.player.releaseLeftButton();
        break;
      }
    }
    if (treeFound) {
      await args.player.walkTo(toolTileLocation);
      args.sendInfo('Árvore cortada');
    } else {
      await args.sendInfo('Árvore não encontrada');
    }
  }
}

export default new CutCommand();
