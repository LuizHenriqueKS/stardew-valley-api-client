import TileLocation from '../model/TileLocation';
import Character from './Character';

interface WalkingpathFinderArgs {
  character?: Character;
  startPoint: TileLocation;
  endPoint: TileLocation;
  distance?: number;
  maxInteractions?: number;
}

export default WalkingpathFinderArgs;
