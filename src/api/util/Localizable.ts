import TileLocation from '../model/TileLocation';

interface Localizable {

  getTileLocation(): Promise<TileLocation>;

}

export default Localizable;
