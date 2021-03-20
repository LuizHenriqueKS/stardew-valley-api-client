import TileLocation from './TileLocation';

interface LargeTerrainFeatureInfo {

  typeName: string;
  x: number;
  y: number;
  location: string;
  health: number;
  canHarvest: boolean;

  getTileLocation(): Promise<TileLocation>;
}

export default LargeTerrainFeatureInfo;
