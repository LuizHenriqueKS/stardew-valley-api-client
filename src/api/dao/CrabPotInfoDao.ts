import CrabPotInfo from '../model/CrabPotInfo';
import TileLocation from '../model/TileLocation';
import Character from '../proxy/Character';
import fillGetTileLocation from '../util/fillGetTileLocation';

class CrabPotInfoDao {
  character: Character;
  location: string | undefined;
  available: boolean;

  constructor(character: Character) {
    this.character = character;
    this.available = false;
  }

  async list(): Promise<CrabPotInfo[]> {
    const currentTileLocation = await this.character.getTileLocation();
    const script = `
        const locations = ${this.getLocationListScript()};
        const result = [];
        for (const location of locations){
          for (const obj of GameJS.ListObjects(location.Name)){
            if ( obj.Name !== 'Crab Pot' ) {
              continue;
            }
            if ( ${this.available} && !GameJS.GetPathMap().HasWalkingPath('${currentTileLocation.location}', location.Name) ){
              continue;
            }
            const bait = RefHelper.OptValue(obj, 'bait')?.Value?.DisplayName;
            const heldObject = RefHelper.OptValue(obj, 'heldObject')?.Value?.DisplayName;
            const model = { location: location.Name, x: obj.TileLocation.X, y: obj.TileLocation.Y, bait, heldObject };
            result.push(model);
          }
        }
        return result;
      `;
    const result = await this.character.ref.client.jsRunner.evaluate(script);
    result.forEach((r: any) => {
      fillGetTileLocation(r);
      if (typeof (r.bait) === 'object') r.bait = undefined;
      if (typeof (r.heldObject) === 'object') r.heldObject = undefined;
    });
    return result;
  }

  async get(tileLocation: TileLocation): Promise<CrabPotInfo> {
    const script = `
        const location = '${tileLocation.location}';
        const obj = GameJS.GetObjectAtTile(location, ${tileLocation.x}, ${tileLocation.y});
        
        const bait = RefHelper.OptValue(obj, 'bait')?.Value?.DisplayName;
        const heldObject = RefHelper.OptValue(obj, 'heldObject')?.Value?.DisplayName;
        const model = { location: location.Name, x: obj.TileLocation.X, y: obj.TileLocation.Y, bait, heldObject };

        return model;
      `;
    const result = await this.character.ref.client.jsRunner.evaluate(script);
    fillGetTileLocation(result);
    if (typeof (result.bait) === 'object') result.bait = undefined;
    if (typeof (result.heldObject) === 'object') result.heldObject = undefined;
    return result;
  }

  private getLocationListScript(): string {
    if (this.location && this.location.toLocaleLowerCase() === 'all') {
      return 'Game1.locations';
    } else if (this.location && this.location.toLocaleLowerCase() === 'here') {
      return `[${this.character.ref.expression}.currentLocation]`;
    } else if (this.location) {
      return `[Game1.getLocationFromName('${this.location}')]`;
    } else {
      return 'Game1.locations';
    }
  }
}

export default CrabPotInfoDao;
