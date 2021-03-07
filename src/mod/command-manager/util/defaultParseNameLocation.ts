import CommandArgs from '../base/CommandArgs';

async function defaultParseNameLocation(args: CommandArgs, index: number): Promise<string | undefined> {
  let location;
  if (args.commandArgs.length > index) {
    location = args.commandArgs[index];
  }
  if (location && location === 'here') {
    return await args.client.bridge.game1.currentLocation.getName();
  }
  return location;
}

export default defaultParseNameLocation;
