import TileLocation from './TileLocation';

interface CropInfo {

  name: string;
  displayName: string;
  x: number;
  y: number;
  location: string;
  canHarvest: boolean;
  watered: boolean;
  dead: boolean;

  getTileLocation(): Promise<TileLocation>;
}

export default CropInfo;
