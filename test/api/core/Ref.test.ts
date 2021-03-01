import Ref from '@/src/api/core/Ref';
import connectAPIClient from '@/src/api/util/connectAPIClient';

it('should test a ref', async () => {
  const client = await connectAPIClient();
  const ref = new Ref(client, 'Test');
  const val = await ref.getPropertyValue('TEN');
  expect(typeof (val)).toBe('number');
  await client.close();
});

it('should test the method sync of ref', async () => {
  const client = await connectAPIClient();
  const ref = new Ref(client, 'Test');
  const synchronizedRef = await ref.sync();
  expect(synchronizedRef.expression === ref.expression).toBeFalsy();
  const val = await synchronizedRef.getPropertyValue('TEN');
  expect(typeof (val)).toBe('number');
  await client.close();
});

it('should test invokation of a method', async () => {
  const client = await connectAPIClient();
  const ref = new Ref(client, 'Test');
  const result = await ref.invokeMethodResult('Sum', 1, 2);
  expect(result).toBe(3);
  await client.close();
});

it('should get type name', async () => {
  const client = await connectAPIClient();
  const ref = new Ref(client, 'new Test()');
  const result = await ref.getTypeName();
  expect(result).toBe('Test');
  await client.close();
});
