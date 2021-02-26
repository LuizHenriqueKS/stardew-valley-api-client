import APIClient from './api/APIClient';
import rl from 'readline-sync';

async function main() {
  const client = new APIClient();
  await client.connect('localhost', 3412);
  console.log('Conectado.');
  await readCommands(client);
}

async function readCommands(client: APIClient) {
  while (client.connected) {
    const command = rl.question('>');
    const reader = await client.jsRunner.run(`return ${command};`);
    const response = await reader.next();
    console.log(response);
  }
}

main().then();
