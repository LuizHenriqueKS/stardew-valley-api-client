import connectAPIClient from '@/src/api/util/connectAPIClient';

it('should fire a event', async () => {
  const client = await connectAPIClient();
  try {
    const reader = client.jsRunner.run('return client.AddEvent(request, Test, "BoolEventHandler").Id;');
    const firstResponse = await reader.next();
    expect(typeof (firstResponse.result)).toBe('number');
    client.jsRunner.run('Test.Fire(true);');
    const secondResponse = await reader.next();
    expect(secondResponse.result.args).toBeTruthy();
  } finally {
    await client.close();
  }
});
