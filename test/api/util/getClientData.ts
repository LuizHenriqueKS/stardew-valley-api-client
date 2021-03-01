import readJSON from '@/src/api/util/readJSON';
import path from 'path';

function getClientData(): any {
  const clientDataPath = path.resolve('./data/client.json');
  return readJSON(clientDataPath);
}

export default getClientData;
