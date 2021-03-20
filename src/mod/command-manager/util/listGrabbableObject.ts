import CropInfoDao from '@/src/api/dao/CropInfoDao';
import LargeTerrainFeatureInfoDao from '@/src/api/dao/LargeTerrainFeatureInfoDao';
import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
import ObjectInfo from '@/src/api/model/ObjectInfo';
import { ZStr } from 'z-str';
import CommandArgs from '../base/CommandArgs';
import defaultParseNameLocation from './defaultParseNameLocation';

async function listGrabbableObjects(args: CommandArgs, startIndex: number): Promise<ObjectInfo[]> {
  const location = await defaultParseNameLocation(args, startIndex);
  const result: ObjectInfo[] = [];
  result.push(...await listObjects(args, startIndex));
  result.push(...await listCrops(args, startIndex));
  result.push(...await lisLargeTerrainsFeature(args, startIndex));
  if (location?.toLocaleLowerCase() === 'available') {
    // result = result.filter(r => r.location !== 'Farm');
  }
  return result;
}

async function lisLargeTerrainsFeature(args: CommandArgs, startIndex: number): Promise<ObjectInfo[]> {
  const location = await defaultParseNameLocation(args, startIndex);
  const dao = new LargeTerrainFeatureInfoDao(args.player);
  dao.location = location?.toLocaleLowerCase() === 'available' ? 'all' : location;
  dao.available = location?.toLocaleLowerCase() === 'available';
  const result = await dao.list();
  const resultFiltred: any = result.filter(r => r.canHarvest);
  resultFiltred.forEach((r: any) => { r.displayName = r.typeName; });
  return resultFiltred;
}

async function listCrops(args: CommandArgs, startIndex: number): Promise<ObjectInfo[]> {
  const location = await defaultParseNameLocation(args, startIndex);
  const dao = new CropInfoDao(args.player);
  dao.location = location?.toLocaleLowerCase() === 'available' ? 'all' : location;
  dao.available = location?.toLocaleLowerCase() === 'available';
  const result = await dao.list();
  const resultFiltred: any = result.filter(r => r.canHarvest && !r.dead);
  return resultFiltred;
}

async function listObjects(args: CommandArgs, startIndex: number) {
  const location = await defaultParseNameLocation(args, startIndex);
  const dao = new ObjectInfoDao(args.player);
  dao.location = location?.toLocaleLowerCase() === 'available' ? 'all' : location;
  dao.available = location?.toLocaleLowerCase() === 'available';

  dao.acceptNames = getAcceptName(args, startIndex + 1);

  if (dao.acceptNames.length === 0) {
    dao.rejectNames = ['Weeds', 'Twig', 'Stone', 'Crab Pot'];
    dao.rejectTypes = ['Crafting'];
  }

  return await dao.list();
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
