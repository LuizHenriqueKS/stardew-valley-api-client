import APIClient from '../APIClient';
import CropInfo from '../model/CropInfo';
import TileLocation from '../model/TileLocation';

class CropInfoDao {
  #client: APIClient;
  location: string | undefined;
  acceptNames: string[];

  constructor(client: APIClient) {
    this.#client = client;
    this.acceptNames = [];
  }

  async list(): Promise<CropInfo[]> {
    const script = `
        const locations = ${this.getLocationListScript()};
        const acceptNames = ${JSON.stringify(this.acceptNames)};
        const result = [];
        for (const location of locations){
          for (const ter of GameJS.ListHoeDirt(location)){
        
            const crop = ter.crop;
            const watered = ter.state == 1;
            const canHarvest = this.currentPhase.Value >= this.phaseDays.Count - 1;
            const infos = GameJS.GetObjectInformation(crop.indexOfHarvest).split('/');
            const name = infos[0];
            const displayName = infos[4];
            const model = { location: location.Name, x: ter.currentTileLocation.X, y: ter.currentTileLocation.Y, watered: watered, canHarvest: canHarvest, name: name, displayName: displayName };
        
            if ( acceptNames.length !== 0 && !acceptNames.includes(model.name) && !acceptNames.includes(model.displayName)){
              continue;
            }
            result.push(model);
          }
        }
        return result;
      `;
    const result = await this.#client.jsRunner.evaluate(script);
    return result;
  }

  async get(tileLocation: TileLocation): Promise<CropInfo> {
    const script = `
        const location = '${tileLocation.location}';
        const ter = GameJS.GetHoeDirtAtTile(location, ${tileLocation.x}, ${tileLocation.y});
        
        const crop = ter.crop;
        const watered = ter.state == 1;
        const canHarvest = this.currentPhase.Value >= this.phaseDays.Count - 1;
        const infos = GameJS.GetObjectInformation(crop.indexOfHarvest).split('/');
        const name = infos[0];
        const displayName = infos[4];
        const model = { location: location.Name, x: ter.currentTileLocation.X, y: ter.currentTileLocation.Y, watered: watered, canHarvest: canHarvest, name: name, displayName: displayName };
          
        return model;
      `;
    const result = await this.#client.jsRunner.evaluate(script);
    return result;
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

export default CropInfoDao;
