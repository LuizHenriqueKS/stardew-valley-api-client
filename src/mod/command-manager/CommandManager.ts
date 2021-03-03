import APIClient from '@/src/api/APIClient';
import ChatMessageEvent from '@/src/api/event/ChatMessageEvent';
import Command from './base/Command';
import AlreadyListeningException from './exception/AlreadyListeningException';
import parseCommandArgs from './util/parseCommandArgs';
import path from 'path';
import fs from 'fs';

class CommandManager {
  logMessages: boolean;
  #listening: boolean;
  #client: APIClient;
  #commands: Command[];

  constructor(client: APIClient) {
    this.logMessages = true;
    this.#listening = false;
    this.#client = client;
    this.#commands = [];
  }

  async listen() {
    this.requireNonListening();
    this.#listening = true;
    await this.loadCommands();
    await this.#client.bridge.helper.events.chat.chatMessageReceived.addListener((sender, args) => {
      if (this.logMessages && args.sourceFarmer !== 0) {
        console.log('Mensagem recebida:', JSON.stringify(args));
      }
      this.processMessage(args);
    });
  }

  processMessage(message: ChatMessageEvent) {
    const commandArgs = parseCommandArgs(this, message);
    if (commandArgs.valid) {
      for (const command of this.#commands) {
        if (command.canExecute(commandArgs)) {
          command.execute(commandArgs).then();
        }
      }
    }
  }

  private async loadCommands() {
    const commandDir = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandDir);
    for (const commandFile of commandFiles) {
      const commandFilePath = path.join(commandDir, commandFile);
      const command = (await import(commandFilePath)).default;
      this.#commands.push(command);
      console.log('Comando carregado:', command.name);
    }
  }

  private requireNonListening() {
    if (this.#listening) {
      throw new AlreadyListeningException();
    }
  }

  get client(): APIClient {
    return this.#client;
  }
}

export default CommandManager;
