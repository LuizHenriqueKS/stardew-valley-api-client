import APIClient from '../APIClient';
import readJSON from './readJSON';

import path from 'path';

async function connectAPIClient(): Promise<APIClient> {
  const configPath = path.resolve('./data/client.json');
  const config = readJSON(configPath);
  const client = new APIClient(config.host, config.port);
  await client.connect();
  return client;
}

export default connectAPIClient;
