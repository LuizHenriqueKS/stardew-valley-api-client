import APIClient from '@/src/api/APIClient';
import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';
import TileLocation from '@/src/api/model/TileLocation';
import Farmer from '@/src/api/proxy/Farmer';
import WalkingPath from '@/src/api/proxy/WalkingPath';
import CommandManager from '../CommandManager';
import CommandArgs from './CommandArgs';

class AutomationArgs {
  commandManager!: CommandManager;
  client!: APIClient;
  player!: Farmer;
  args!: CommandArgs;
  tileLocation!: TileLocation;

  async toolTo(endPoint: TileLocation) {
    const walkingPath = await this.getWalkingPath(endPoint);
    if (walkingPath) {
      await walkingPath.walk();
      await this.client.bridge.game1.input.simulateMousePositionAtTile(endPoint.x, endPoint.y).next();
    }
  }

  private async getWalkingPath(tileLocation: TileLocation): Promise<WalkingPath | undefined> {
    for (let x = tileLocation.x - 1; x <= tileLocation.x + 1; x++) {
      for (let y = tileLocation.y - 1; y <= tileLocation.y + 1; y++) {
        if (tileLocation.x !== x || tileLocation.y !== y) {
          if (await this.client.bridge.game1.currentLocation.isTileLocationOpen(x, y)) {
            try {
              const neighbor = { x, y, location: tileLocation.location };
              return await this.player.findWalkingPathTo(neighbor);
            } catch (e) {
              if (!(e instanceof WalkingPathNotFoundException)) {
                throw e;
              }
            }
          }
        }
      }
    }
  }
}

export default AutomationArgs;
