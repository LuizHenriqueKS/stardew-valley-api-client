import Position from '../model/Position';
import TileLocation from '../model/TileLocation';

class WalkingEvent {
  finished!: boolean;
  canceled!: boolean;
  tileLocation!: TileLocation;
  position!: Position;
}

export default WalkingEvent;
