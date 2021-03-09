import APIClient from '@/src/api/APIClient';
import ChatMessageEvent from '@/src/api/event/ChatMessageEvent';
import Command from './base/Command';
import AlreadyListeningException from './exception/AlreadyListeningException';
import parseCommandArgs from './util/parseCommandArgs';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import Keys from '@/src/api/enums/Keys';
import JSResponseReader from '@/src/api/core/JSResponseReader';
import autoCommand from './commands/AutoCommand';

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
        const dateTime = moment().format('DD/MM/YYYY HH:mm:ss');
        console.log(`[${dateTime}] ${args.sourceFarmerName}: ${args.message}`);
      }
      this.processMessage(args);
    });
    await this.#client.bridge.helper.events.input.buttonReleased.addListener((Sender, args) => {
      if (args.button === Keys.VK_Q) {
        const character = this.#client.bridge.game1.player;
        this.#client.jsRunner.run(`GameJS.GetWalker(${character.ref.expression}).Stop(request)`);
        this.#client.jsRunner.run(`GameJS.GetPathFinder(${character.ref.expression}).Stop(request)`);
        this.#client.jsRunner.run(`GameJS.GetFisher(${character.ref.expression}).Stop()`);
        this.#client.bridge.game1.input.disableSimulations();
        autoCommand.canceled = true;
        this.sendInfo('Ação atual cancelada');
      } else if (args.button === Keys.VK_R) {
        this.#client.bridge.game1.input.pressRightButton().then();
      }
    });
    this.#client.bridge.game1.chatBox.addInfoMessage('APIClient conectado');
  }

  processMessage(message: ChatMessageEvent) {
    const commandArgs = parseCommandArgs(this, message);
    if (commandArgs.valid) {
      for (const command of this.#commands) {
        command.canExecute(commandArgs).then(result => {
          if (result) {
            command.execute(commandArgs).then();
          }
        });
      }
    }
  }

  sendInfo(message: string): JSResponseReader {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');
    console.log(`[${datetime}] ApiBot: ${message}`);
    return this.client.bridge.game1.chatBox.addInfoMessage(message);
  }

  sendError(message: string): JSResponseReader {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');
    console.error(`[${datetime}] ApiBot: ${message}`);
    return this.client.bridge.game1.chatBox.addErrorMessage(message);
  }

  private async loadCommands() {
    const commandDir = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandDir);
    for (const commandFile of commandFiles) {
      if (commandFile.toLocaleLowerCase().endsWith('.ts')) {
        const commandFilePath = path.join(commandDir, commandFile);
        const command = (await import(commandFilePath)).default;
        this.#commands.push(command);
        console.log('Comando carregado:', command.name);
      }
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
