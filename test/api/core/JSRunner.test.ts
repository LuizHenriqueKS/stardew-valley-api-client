import connectAPIClient from '@/src/api/util/connectAPIClient';

it('should run javascript and get result', async () => {
  const client = await connectAPIClient();
  const responseReader = await client.jsRunner.run('return 2+5');
  const response = await responseReader.next();
  expect(response.result).toBe(7);
  await client.close();
});

it('should create a constant', async () => {
  const client = await connectAPIClient();
  const script = `
    const abc = Test;
    return abc.TEN;
  `;
  const result = await client.jsRunner.evaluate(script);
  expect(result).toBe(10);
  await client.close();
});

it('should return a object', async () => {
  const client = await connectAPIClient();
  const script = 'return {x: 1, y: 2};';
  const result = await client.jsRunner.evaluate(script);
  expect(result).toStrictEqual({ x: 1, y: 2 });
  await client.close();
});
