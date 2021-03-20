import ObjectInfo from '../model/ObjectInfo';
import TileLocation from '../model/TileLocation';
import Character from '../proxy/Character';
import fillGetTileLocation from '../util/fillGetTileLocation';

class ObjectInfoDao {
  character: Character;
  location: string | undefined;
  available: boolean;
  acceptNames: string[];
  rejectNames: string[];
  rejectTypes: string[];

  constructor(character: Character) {
    this.character = character;
    this.acceptNames = [];
    this.rejectNames = [];
    this.rejectTypes = [];
    this.available = false;
  }

  async list(): Promise<ObjectInfo[]> {
    const currentTileLocation = await this.character.getTileLocation();
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
            if ( ${this.available} && !GameJS.GetPathMap().HasWalkingPath('${currentTileLocation.location}', location.Name) ){
              continue;
            }
            const model = { location: location.Name, x: obj.TileLocation.X, y: obj.TileLocation.Y, name: obj.Name, displayName: obj.DisplayName, edibility: obj.Edibility, type: obj.Type, category: obj.Category };
            result.push(model);
          }
        }
        return result;
      `;
    const result = await this.character.ref.client.jsRunner.evaluate(script);
    result.forEach((r: any) => fillGetTileLocation(r));
    return result;
  }

  async get(tileLocation: TileLocation): Promise<ObjectInfo | undefined> {
    const script = `
        const location = '${tileLocation.location}';
        const obj = GameJS.GetObjectAtTile(location, ${tileLocation.x}, ${tileLocation.y});
        
        if (obj && obj.Name){
          const model = { location: location.Name, x: obj.TileLocation.X, y: obj.TileLocation.Y, name: obj.Name, displayName: obj.DisplayName, edibility: obj.Edibility, type: obj.Type, category: obj.Category };
          return model;
        } else {
          return {};
        }

      `;
    const result: ObjectInfo = await this.character.ref.client.jsRunner.evaluate(script);
    fillGetTileLocation(result);
    return result.name ? result : undefined;
  }

  private getLocationListScript(): string {
    if (this.location && this.location.toLocaleLowerCase() === 'all') {
      return 'Game1.locations';
    } else if (this.location && this.location.toLocaleLowerCase() === 'here') {
      return `[${this.character.ref.expression}]`;
    } else if (this.location) {
      return `[Game1.getLocationFromName('${this.location}')]`;
    } else {
      return 'Game1.locations';
    }
  }
}

export default ObjectInfoDao;
