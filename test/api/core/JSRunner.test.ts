import APIClient from '@/src/api/APIClient';
import getSettings from '@/src/api/util/getSettings';

it('should run javascript and get result', async () => {
  const settings = getSettings();
  const client = new APIClient();
  await client.connect(settings.apiServerHost, settings.apiServerPort);
  const responseReader = await client.jsRunner.run('return 2+5');
  const response = await responseReader.next();
  expect(response.result).toBe(7);
  await client.close();
});
