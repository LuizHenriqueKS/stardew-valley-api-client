import CropInfoDao from '@/src/api/dao/CropInfoDao';
import LargeTerrainFeatureInfoDao from '@/src/api/dao/LargeTerrainFeatureInfoDao';
import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
import TerrainFeatureInfoDao from '@/src/api/dao/TerrainFeatureInfoDao';
import LargeTerrainFeatureInfo from '@/src/api/model/LargeTerrainFeatureInfo';
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
    const object = await new ObjectInfoDao(args.player).get(tileLocation);
    const terrainFeature = await new TerrainFeatureInfoDao(args.client).get(tileLocation);
    const largeTerrainFeature = await new LargeTerrainFeatureInfoDao(args.player).get(tileLocation);
    this.sendObjectInfo(args, object);
    await this.sendTerrainFeatureInfo(args, terrainFeature);
    await this.sendLargeTerrainFeatureInfo(args, largeTerrainFeature);
    this.sendInfoNotFound(args, object, terrainFeature);
  }

  private sendObjectInfo(args: CommandArgs, object?: ObjectInfo) {
    if (object) {
      args.sendInfo(`Nome do objeto: ${object.displayName} (${object.name})`);
    }
  }

  private async sendLargeTerrainFeatureInfo(args: CommandArgs, largeTerrainFeature?: LargeTerrainFeatureInfo) {
    if (largeTerrainFeature) {
      await args.sendInfo(`Nome do terreno grande: ${largeTerrainFeature.typeName}`);
      await args.sendInfo(`Com frutinhas: ${largeTerrainFeature.canHarvest ? 'Sim' : 'Não'}`);
    }
  }

  private async sendTerrainFeatureInfo(args: CommandArgs, terrainFeature?: TerrainFeatureInfo) {
    if (terrainFeature) {
      await args.sendInfo(`Nome do terreno: ${terrainFeature.typeName}`);
      if (terrainFeature.health) {
        await args.sendInfo(`Saúde: ${terrainFeature.health}`);
      }
      const cropDao = new CropInfoDao(args.player);
      const crop = await cropDao.get(await terrainFeature.getTileLocation());
      if (crop != null) {
        await args.sendInfo(`Plantação: ${crop.displayName}`);
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
