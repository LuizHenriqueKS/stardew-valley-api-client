import TileLocation from './TileLocation';

interface ObjectInfo {
  location: string;
  x: number;
  y: number;
  name: string;
  displayName: string;
  edibility: number;
  type: number;
  category: number;

  getTileLocation(): Promise<TileLocation>;
}

export default ObjectInfo;
