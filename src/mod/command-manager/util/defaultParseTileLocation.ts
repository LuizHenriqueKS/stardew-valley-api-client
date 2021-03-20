import TileLocation from '@/src/api/model/TileLocation';
import CommandArgs from '../base/CommandArgs';
import InvalidArgumentsException from '../exception/InvalidArgumentsException';

async function defaultParseTileLocation(args: CommandArgs, index: number = 0): Promise<TileLocation> {
  const location = await parseLocation(args, index);
  const x = parseInt(args.commandArgs[index]);
  const y = parseInt(args.commandArgs[index + 1]);
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

async function parseLocation(args: CommandArgs, index: number = 0): Promise<string> {
  let location = args.commandArgs.length > 2 + index ? args.commandArgs[2 + index] : (await args.player.currentLocation.getName());
  if (location && location.toLocaleLowerCase() === 'here') {
    location = await args.player.currentLocation.getName();
  }
  return location;
}

export default defaultParseTileLocation;
