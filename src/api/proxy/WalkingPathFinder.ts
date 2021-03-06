import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import EscapedValue from '../model/EscapedValue';
import TileLocation from '../model/TileLocation';
import WalkingpathFinderArgs from './WalkingPathFinderArgs';

class WalkingPathFinder extends Proxy<WalkingPathFinder> {
  sub(ref: Ref): WalkingPathFinder {
    return new WalkingPathFinder(ref);
  }

  async find(args: WalkingpathFinderArgs): Promise<TileLocation[]> {
    const localArgs: WalkingpathFinderArgs = { maxInteractions: 10000, ...args };
    const startPoint = this.tileLocationToRefExpression(localArgs.startPoint);
    const endPoint = this.tileLocationToRefExpression(localArgs.endPoint);
    const result = await this.ref.sub('GameJS').invokeMethodResult('FindWalkPath', localArgs.character, startPoint, endPoint, localArgs.distance, localArgs.maxInteractions);
    return result;
  }

  private tileLocationToRefExpression(tileLocation: TileLocation): EscapedValue {
    return new EscapedValue(`new TileLocationModel('${tileLocation.location}', ${tileLocation.x}, ${tileLocation.y})`);
  }
}

export default WalkingPathFinder;
