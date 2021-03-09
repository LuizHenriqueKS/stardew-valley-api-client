import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
import { ZStr } from 'z-str';
import CommandArgs from '../base/CommandArgs';
import defaultParseNameLocation from './defaultParseNameLocation';

async function listGrabbableObjects(args: CommandArgs, startIndex: number) {
  const location = await defaultParseNameLocation(args, startIndex);
  const lister = new ObjectInfoDao(args.client);
  lister.location = location;

  lister.acceptNames = getAcceptName(args, startIndex + 1);

  if (lister.acceptNames.length === 0) {
    lister.rejectNames = ['Weeds', 'Twig', 'Stone'];
    lister.rejectTypes = ['Crafting'];
  }

  return await lister.list();
}

function getAcceptName(args: CommandArgs, startIndex: number) {
  if (args.commandArgs.length <= startIndex) {
    return [];
  } else {
    let result = new ZStr(args.commandArgsText);
    for (let i = 0; i < startIndex; i++) {
      result = result.from(' ');
    }
    return [result.toString()];
  }
}

export default listGrabbableObjects;
