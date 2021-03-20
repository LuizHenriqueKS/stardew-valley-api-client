import TileLocation from './TileLocation';

interface CrabPotInfo {
  location: string;
  x: number;
  y: number;
  bait?: string;
  heldObject?: string;

  getTileLocation(): Promise<TileLocation>;
}

export default CrabPotInfo;
