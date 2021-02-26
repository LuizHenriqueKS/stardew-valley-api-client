import APIClient from '@/src/api/APIClient';
import Ref from '@/src/api/core/Ref';
import getSettings from '@/src/api/util/getSettings';

it('should test a ref', async () => {
  const settings = getSettings();
  const client = new APIClient();
  await client.connect(settings.apiServerHost, settings.apiServerPort);
  const ref = new Ref(client, 'Game1.player.Position');
  const val = await ref.getPropertyValue('X');
  expect(typeof (val)).toBe('number');
  await client.close();
});

it('should test the method sync of ref', async () => {
  const settings = getSettings();
  const client = new APIClient();
  await client.connect(settings.apiServerHost, settings.apiServerPort);
  const ref = new Ref(client, 'Game1.player.Position');
  const synchronizedRef = await ref.sync();
  expect(synchronizedRef.expression.startsWith("engine.getReference('ref#")).toBeTruthy();
  const val = await synchronizedRef.getPropertyValue('X');
  expect(typeof (val)).toBe('number');
  await client.close();
});

it('should test invokation of a method', async () => {
  const settings = getSettings();
  const client = new APIClient();
  await client.connect(settings.apiServerHost, settings.apiServerPort);
  const ref = new Ref(client, 'Game1.player');
  await ref.invokeMethod('SetMovingDown', true);
  const result = await ref.getPropertyValue('IsMovingDown');
  await ref.invokeMethod('SetMovingDown', false);
  expect(result).toBe(true);
  await client.close();
});
