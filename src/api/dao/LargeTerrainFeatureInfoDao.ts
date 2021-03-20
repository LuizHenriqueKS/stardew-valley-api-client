import LargeTerrainFeatureInfo from '../model/LargeTerrainFeatureInfo';
import TileLocation from '../model/TileLocation';
import Character from '../proxy/Character';
import fillGetTileLocation from '../util/fillGetTileLocation';

class LargeTerrainFeatureInfoDao {
  character: Character;
  location: string | undefined;
  available: boolean;
  acceptTypeNames: string[];

  constructor(character: Character) {
    this.character = character;
    this.acceptTypeNames = [];
    this.available = false;
  }

  async list(): Promise<LargeTerrainFeatureInfo[]> {
    const currentTileLocation = await this.character.getTileLocation();
    const script = `
        const locations = ${this.getLocationListScript()};
        const acceptTypeNames = ${JSON.stringify(this.acceptTypeNames)};
        const result = [];
        for (const location of locations){
          for (const ter of GameJS.ListLargeTerrainFeature(location)){
            if ( acceptTypeNames.length !== 0 && !acceptTypeNames.includes(ter.GetType().Name) ){
              continue;
            }
            if ( ${this.available} && !GameJS.GetPathMap().HasWalkingPath('${currentTileLocation.location}', location.Name) ){
              continue;
            }
            const health = RefHelper.OptValue(ter, 'health');
            const tileSheetOffset = RefHelper.OptValue(ter, 'tileSheetOffset');
            const townBush = RefHelper.OptValue(ter, 'townBush').Value;
            const model = { 
              location: location.Name, 
              x: ter.tilePosition.X, y: 
              ter.tilePosition.Y, 
              typeName: ter.GetType().Name, 
              canHarvest: tileSheetOffset && tileSheetOffset.Value > 0 && !townBush && false,
              health: health?health:undefined,
              tileSheetOffset,
              townBush
            };
            result.push(model);
          }
        }
        return result;
      `;
    const result = await this.character.ref.client.jsRunner.evaluate(script);
    result.forEach((r: any) => fillGetTileLocation(r));
    return result;
  }

  async get(tileLocation: TileLocation): Promise<LargeTerrainFeatureInfo> {
    const script = `
        const location = Game1.getLocationFromName('${tileLocation.location}');
        const ter = GameJS.GetLargeTerrainFeatureAtTile(location, ${tileLocation.x}, ${tileLocation.y});
        
        if (ter){
          const health = RefHelper.OptValue(ter, 'health');
          const tileSheetOffset = RefHelper.OptValue(ter, 'tileSheetOffset');
          const townBush = RefHelper.OptValue(ter, 'townBush').Value;
          const model = { 
            location: location.Name, 
            x: ter.tilePosition.X, y: 
            ter.tilePosition.Y, 
            typeName: ter.GetType().Name, 
            canHarvest: tileSheetOffset && tileSheetOffset.Value > 0 && !townBush,
            health: health?health:undefined,
            tileSheetOffset,
            townBush
          };
          return model;
        } else {
          return {};
        }
      `;
    const result = await this.character.ref.client.jsRunner.evaluate(script);
    result.health = Array.isArray(result.health) ? result.health[0] : undefined;
    fillGetTileLocation(result);
    return result.typeName ? result : undefined;
  }

  private getLocationListScript(): string {
    if (this.location && this.location.toLocaleLowerCase() === 'all') {
      return 'Game1.locations';
    } else if (this.location) {
      return `[Game1.getLocationFromName('${this.location}')]`;
    } else {
      return 'Game1.locations';
    }
  }
}

export default LargeTerrainFeatureInfoDao;
