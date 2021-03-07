import APIClient from '../APIClient';
import ChestItemInfo from '../model/ChestItemInfo';

class ChestItemInfoLister {
  #client: APIClient;
  location: string | undefined;
  acceptNames: string[];
  rejectNames: string[];

  constructor(client: APIClient) {
    this.#client = client;
    this.acceptNames = [];
    this.rejectNames = [];
  }

  async list(): Promise<ChestItemInfo[]> {
    const script = `
        const locations = ${this.getLocationListScript()};
        const acceptNames = ${JSON.stringify(this.acceptNames)};
        const rejectNames = ${JSON.stringify(this.rejectNames)};
        const result = [];
        for (const location of locations){
          for (const obj of GameJS.ListObjects(location.Name)){
            if (obj && obj.Name === 'Chest'){
              let index = -1;
              for (const item of GameJS.ListItemsFromChest(obj)){
                index ++;
                if (item){
                  if ( acceptNames.length !== 0 && !acceptNames.includes(item.Name) && !acceptNames.includes(item.DisplayName) ){
                    continue;
                  }
                  if ( rejectNames.length !== 0 && (rejectNames.includes(item.Name) || rejectNames.includes(item.DisplayName)) ) {
                    continue;
                  }
                  const model = { location: location.Name, x: obj.TileLocation.X, y: obj.TileLocation.Y, name: item.Name, displayName: item.DisplayName, type: item.GetType().Name, index: index, stack: item.Stack };
                  result.push(model);
                }
              }
            }
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

export default ChestItemInfoLister;
