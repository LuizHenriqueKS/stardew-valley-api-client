import APIClient from './api/APIClient';
import rl from 'readline';
import connectAPIClient from './api/util/connectAPIClient';
import CommandManager from './mod/command-manager/CommandManager';

// import Keys from '@/src/api/enums/Keys';

async function main() {
  const client = await connectAPIClient();
  console.log('Conectado.');
  const commandManager = new CommandManager(client);
  await commandManager.listen();
  readCommands(client);
}

function readCommands(client: APIClient) {
  const reader = rl.createInterface(process.stdin, process.stdout);
  const loop = () => {
    reader.question('>', (command) => {
      if (command.startsWith('>')) {
        client.jsRunner.run(command.substr(1)).next().then(result => {
          loop();
        });
      } else {
        client.jsRunner.evaluate(`return ${command};`).then(result => {
          console.log(result);
          loop();
        });
      }
    });
  };
  loop();
}

/*
async function testWithKeys(client: APIClient) {
  client.bridge.helper.events.input.buttonReleased.addListener(async (sender, args) => {
    if (args.button === Keys.VK_ENTER) {
      client.bridge.game1.pressUseToolButton().then(res => {
        console.log('pressUseToolButton', res);
      });
    } else if (args.button === Keys.VK_K) {
      client.bridge.game1.input.pressRightButton();
    } else if (args.button === Keys.VK_G) {
      client.bridge.game1.input.pressKey(Keys.VK_E);
    } else if (args.button === Keys.VK_R) {
      client.bridge.game1.player.getFacingDirection().then(fd => {
        client.bridge.game1.player.setFacingDirection((fd + 1) % 4);
      });
    } else if (args.button === Keys.VK_J) {
      const p = await client.bridge.game1.player.findWalkPathTo({ x: 80, y: 17, location: 'Farm' });
      await p.move();
    }
  });
} */

main().then();
