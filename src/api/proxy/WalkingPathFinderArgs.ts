import TileLocation from '../model/TileLocation';

interface WalkingPathFinderArgs {
  endPoint: TileLocation;
  distance?: number;
  maxInteractions?: number;
}

export default WalkingPathFinderArgs;
