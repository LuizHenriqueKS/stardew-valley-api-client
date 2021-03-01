import APISocket from '@/src/api/core/APISocket';
import getClientData from '../util/getClientData';

it('should test readJSON', async () => {
  const clientData = getClientData();
  const socket = new APISocket(clientData.host, clientData.port);
  await socket.connect();
  socket.sendJSON({ id: 0, command: { name: 'Ping' } });
  const response = await socket.readJSON();
  expect(response).toStrictEqual({
    id: 0,
    result: 'Pong',
    type: 0
  });
  socket.close();
});

it('should test javascript', async () => {
  const clientData = getClientData();
  const socket = new APISocket(clientData.host, clientData.port);
  await socket.connect();
  socket.sendJSON({
    id: 1,
    command: {
      name: 'RunJS',
      args: {
        script: 'return 2 + 3;'
      }
    }
  });
  const response = await socket.readJSON();
  expect(response).toStrictEqual({
    id: 1,
    result: 5,
    type: 0
  });
  socket.close();
});

it('should test context javascript', async () => {
  const clientData = getClientData();
  const socket = new APISocket(clientData.host, clientData.port);
  await socket.connect();
  const request = {
    id: 3,
    command: {
      name: 'RunJS',
      args: {
        script: 'const a = 1 + 9; return a;'
      }
    }
  };
  socket.sendJSON(request);
  socket.sendJSON(request);
  const response = await socket.readJSON();
  expect(response).toStrictEqual({
    id: 3,
    result: 10,
    type: 0
  });
  socket.close();
});
