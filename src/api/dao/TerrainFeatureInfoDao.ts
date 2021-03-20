import APIClient from '../APIClient';
import TerrainFeatureInfo from '../model/TerrainFeatureInfo';
import TileLocation from '../model/TileLocation';
import fillGetTileLocation from '../util/fillGetTileLocation';

class TerrainFeatureInfoDao {
  #client: APIClient;
  location: string | undefined;
  acceptTypeNames: string[];

  constructor(client: APIClient) {
    this.#client = client;
    this.acceptTypeNames = [];
  }

  async list(): Promise<TerrainFeatureInfo[]> {
    const script = `
        const locations = ${this.getLocationListScript()};
        const acceptTypeNames = ${JSON.stringify(this.acceptTypeNames)};
        const result = [];
        for (const location of locations){
          for (const ter of GameJS.ListTerrainFeature(location)){
            if ( acceptTypeNames.length !== 0 && !acceptTypeNames.includes(ter.GetType().Name) ){
              continue;
            }
            const health = RefHelper.OptValue(ter, 'health');
            const model = { 
              location: location.Name, 
              x: ter.currentTileLocation.X, y: 
              ter.currentTileLocation.Y, 
              typeName: ter.GetType().Name, 
              watered: ter.state == 1, 
              health: health?health:undefined
            };
            result.push(model);
          }
        }
        return result;
      `;
    const result = await this.#client.jsRunner.evaluate(script);
    result.forEach((r: any) => fillGetTileLocation(r));
    return result;
  }

  async get(tileLocation: TileLocation): Promise<TerrainFeatureInfo> {
    const script = `
        const location = Game1.getLocationFromName('${tileLocation.location}');
        const ter = GameJS.GetTerrainFeatureAtTile(location, ${tileLocation.x}, ${tileLocation.y});
        
        if (ter){
          const health = RefHelper.OptValue(ter, 'health');
          const model = { 
            location: location.Name, 
            x: ter.currentTileLocation.X, y: 
            ter.currentTileLocation.Y, 
            typeName: ter.GetType().Name, 
            watered: ter.state == 1, 
            health: health?health:undefined
          };
          return model;
        } else {
          return {};
        }
      `;
    const result = await this.#client.jsRunner.evaluate(script);
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

export default TerrainFeatureInfoDao;
