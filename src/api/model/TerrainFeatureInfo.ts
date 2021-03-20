import TileLocation from './TileLocation';

interface TerrainFeatureInfo {

  typeName: string;
  x: number;
  y: number;
  location: string;
  watered: boolean;
  health: number;

  getTileLocation(): Promise<TileLocation>;
}

export default TerrainFeatureInfo;
