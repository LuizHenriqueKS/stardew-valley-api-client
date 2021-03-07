import TileLocation from '@/src/api/model/TileLocation';
import CommandArgs from '../base/CommandArgs';
import InvalidArgumentsException from '../exception/InvalidArgumentsException';

async function defaultParseTileLocation(args: CommandArgs): Promise<TileLocation> {
  const location = await parseLocation(args);
  const x = parseInt(args.commandArgs[0]);
  const y = parseInt(args.commandArgs[1]);
  const result: TileLocation = {
    x,
    y,
    location
  };
  if (!location) throw new InvalidArgumentsException();
  if (typeof (x) !== 'number' || typeof (y) !== 'number' || isNaN(x) || isNaN(y)) {
    throw new InvalidArgumentsException();
  }
  return result;
}

async function parseLocation(args: CommandArgs): Promise<string> {
  let location = args.commandArgs.length > 2 ? args.commandArgs[2] : (await args.player.currentLocation.getName());
  if (location && location.toLocaleLowerCase() === 'here') {
    location = await args.player.currentLocation.getName();
  }
  return location;
}

export default defaultParseTileLocation;
