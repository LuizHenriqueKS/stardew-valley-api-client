import TileLocation from '../model/TileLocation';

interface WalkingPathFinderResult {

  finished: boolean;
  canceled: boolean;
  data: TileLocation[];

}

export default WalkingPathFinderResult;
