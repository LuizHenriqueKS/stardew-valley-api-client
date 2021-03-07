import APIClient from '../APIClient';
import ObjectInfo from '../model/ObjectInfo';

class ObjectInfoLister {
  #client: APIClient;
  location: string | undefined;
  acceptNames: string[];
  rejectNames: string[];
  rejectTypes: string[];

  constructor(client: APIClient) {
    this.#client = client;
    this.acceptNames = [];
    this.rejectNames = [];
    this.rejectTypes = [];
  }

  async list(): Promise<ObjectInfo[]> {
    const script = `
        const locations = ${this.getLocationListScript()};
        const acceptNames = ${JSON.stringify(this.acceptNames)};
        const rejectNames = ${JSON.stringify(this.rejectNames)};
        const rejectTypes = ${JSON.stringify(this.rejectTypes)};
        const result = [];
        for (const location of locations){
          for (const obj of GameJS.ListObjects(location.Name)){
            if ( acceptNames.length !== 0 && !acceptNames.includes(obj.Name) && !acceptNames.includes(obj.DisplayName) ){
              continue;
            }
            if ( rejectNames.length !== 0 && (rejectNames.includes(obj.Name) || rejectNames.includes(obj.DisplayName)) ) {
              continue;
            }
            if ( rejectTypes.length !==0 && rejectTypes.includes(obj.Type)) {
              continue;
            }
            const model = { location: location.Name, x: obj.TileLocation.X, y: obj.TileLocation.Y, name: obj.Name, displayName: obj.DisplayName, edibility: obj.Edibility, type: obj.Type, category: obj.Category };
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

export default ObjectInfoLister;
