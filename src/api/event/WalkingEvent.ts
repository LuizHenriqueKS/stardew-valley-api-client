import Position from '../model/Position';
import TileLocation from '../model/TileLocation';

class WalkingEvent {
  finished!: boolean;
  tileLocation!: TileLocation;
  position!: Position;
}

export default WalkingEvent;
