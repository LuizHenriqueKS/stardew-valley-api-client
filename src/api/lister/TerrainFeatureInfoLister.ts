import APIClient from '../APIClient';
import TerrainFeatureInfo from '../model/TerrainFeatureInfo';

class TerrainFeatureInfoLister {
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
          for (const ter of location._activeTerrainFeatures){
            if ( acceptTypeNames.length !== 0 && !acceptTypeNames.includes(ter.GetType().Name) ){
              continue;
            }
            const model = { location: location.Name, x: ter.currentTileLocation.X, y: ter.currentTileLocation.Y, typeName: ter.GetType().Name };
            result.push(model);
          }
        }
        return result;
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

export default TerrainFeatureInfoLister;
