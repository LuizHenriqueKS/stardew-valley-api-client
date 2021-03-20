import TileLocation from './TileLocation';

interface ChestItemInfo {
  location: string;
  x: number;
  y: number;
  name: string;
  displayName: string;
  index: number;
  stack: number;

  getTileLocation(): Promise<TileLocation>
}

export default ChestItemInfo;
