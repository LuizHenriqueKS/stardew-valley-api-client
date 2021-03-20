import ResponseType from '../enums/ResponseType';
import JSRemoteErrorException from '../exception/JSRemoteErrorException';
import CropInfo from '../model/CropInfo';
import TileLocation from '../model/TileLocation';
import Character from '../proxy/Character';
import fillGetTileLocation from '../util/fillGetTileLocation';

class CropInfoDao {
  character: Character;
  location: string | undefined;
  available: boolean;
  acceptNames: string[];

  constructor(character: Character) {
    this.character = character;
    this.acceptNames = [];
    this.available = false;
  }

  async list(): Promise<CropInfo[]> {
    const currentTileLocation = await this.character.getTileLocation();
    const script = `
        const locations = ${this.getLocationListScript()};
        const acceptNames = ${JSON.stringify(this.acceptNames)};
        const result = [];
        for (const location of locations){
          for (const ter of GameJS.ListHoeDirt(location)){
        
            const crop = ter.crop;
            if (crop){
              const indexOfHarvest = crop.indexOfHarvest.Value;
              const watered = ter.state == 1;
              const canHarvest = crop.currentPhase.Value >= crop.phaseDays.Count - 1;
              const infos = GameJS.GetObjectInformation(indexOfHarvest).split('/');
              const name = infos[0];
              const displayName = infos[4];
              const model = { indexOfHarvest: indexOfHarvest, location: location.Name, x: ter.currentTileLocation.X, y: ter.currentTileLocation.Y, watered: watered, canHarvest: canHarvest, name: name, displayName: displayName, currentPhase: crop.currentPhase.Value, lastPhase: crop.phaseDays.Count-1, dead: crop.dead.Value };
     
              if ( acceptNames.length !== 0 && !acceptNames.includes(model.name) && !acceptNames.includes(model.displayName)){
                continue;
              }
              if ( ${this.available} && !GameJS.GetPathMap().HasWalkingPath('${currentTileLocation.location}', location.Name) ){
                continue;
              }
              result.push(model);
            }
          }
        }
        return result;
      `;
    const response = await this.character.ref.client.jsRunner.run(script).next();
    if (response.type === ResponseType.ERROR) throw new JSRemoteErrorException(response.result);
    const result = response.result;
    result.forEach((r: any) => fillGetTileLocation(r));
    return result;
  }

  async get(tileLocation: TileLocation): Promise<CropInfo> {
    const script = `
        const location = Game1.getLocationFromName('${tileLocation.location}');
        const ter = GameJS.GetHoeDirtAtTile(location, ${tileLocation.x}, ${tileLocation.y});
        
        const crop = ter.crop;
        if (!crop) return null;
        const indexOfHarvest = crop.indexOfHarvest.Value;
        const watered = ter.state == 1;
        const canHarvest = crop.currentPhase.Value >= crop.phaseDays.Count - 1;
        const infos = GameJS.GetObjectInformation(indexOfHarvest).split('/');
        const name = infos[0];
        const displayName = infos[4];
        const model = { indexOfHarvest: indexOfHarvest, location: location.Name, x: ter.currentTileLocation.X, y: ter.currentTileLocation.Y, watered: watered, canHarvest: canHarvest, name: name, displayName: displayName, currentPhase: crop.currentPhase.Value, lastPhase: crop.phaseDays.Count-1, dead: crop.dead.Value };
     
        return model;
      `;
    const result = await this.character.ref.client.jsRunner.evaluate(script);
    fillGetTileLocation(result);
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

export default CropInfoDao;
