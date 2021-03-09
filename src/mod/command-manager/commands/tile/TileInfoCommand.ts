import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
import TerrainFeatureInfoDao from '@/src/api/dao/TerrainFeatureInfoDao';
import ObjectInfo from '@/src/api/model/ObjectInfo';
import TerrainFeatureInfo from '@/src/api/model/TerrainFeatureInfo';
import TileLocation from '@/src/api/model/TileLocation';
import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';

class TileInfoCommand implements Command {
  name: string = 'Info';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    const pos = await args.client.bridge.game1.input.getMousePositionAtTile();
    const locationName = await args.client.bridge.game1.currentLocation.getName();
    const tileLocation: TileLocation = {
      location: locationName,
      x: pos.x,
      y: pos.y
    };
    const object = await new ObjectInfoDao(args.client).get(tileLocation);
    const terrainFeature = await new TerrainFeatureInfoDao(args.client).get(tileLocation);
    this.sendObjectInfo(args, object);
    this.sendTerrainFeatureInfo(args, terrainFeature);
    this.sendInfoNotFound(args, object, terrainFeature);
  }

  private sendObjectInfo(args: CommandArgs, object?: ObjectInfo) {
    if (object) {
      args.sendInfo(`Nome do objeto: ${object.displayName} (${object.name})`);
    }
  }

  private sendTerrainFeatureInfo(args: CommandArgs, terrainFeature?: TerrainFeatureInfo) {
    if (terrainFeature) {
      args.sendInfo(`Nome do terreno: ${terrainFeature.typeName}`);
      if (terrainFeature.health) {
        args.sendInfo(`Saúde: ${terrainFeature.health}`);
      }
    }
  }

  private sendInfoNotFound(args: CommandArgs, ...objs: any) {
    for (const obj of objs) {
      if (obj) return;
    }
    args.sendInfo('Nenhuma informação encontrada.');
  }
}

export default new TileInfoCommand();
