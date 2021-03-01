import APIClient from '@/src/api/APIClient';
import Keys from '@/src/api/enums/Keys';
import Automation from './automation/Automation';
import automations from './automation/Automations';

class AutopilotMod {
  #client: APIClient;
  #activated: boolean;
  #automation?: Automation;
  #automations: Automation[];

  constructor(client: APIClient) {
    this.#client = client;
    this.#activated = false;
    this.#automations = automations.listAutomations(this);
  }

  async listen() {
    await this.listenButtonReleasedEvent();
  }

  async listenButtonReleasedEvent() {
    await this.#client.bridge.helper.events.input.buttonReleased.addListener((sender, args) => {
      if (args.button === Keys.VK_P) {
        if (!this.#activated) {
          this.activate().then();
        }
      } else if (this.#activated) {
        this.deactivate();
      }
    });
  }

  async findActivableAutomation(): Promise<Automation | undefined> {
    for (const automation of this.#automations) {
      if (await automation.canActive()) {
        return automation;
      }
    }
    return undefined;
  }

  async activate() {
    if (!this.#activated) {
      this.#automation = await this.findActivableAutomation();
      if (this.#automation) {
        this.#activated = true;
        await this.#automation.start();
      }
    }
  }

  async deactivate() {
    if (this.#activated) {
      this.#activated = false;
      if (this.#automation) {
        await this.#automation.stop();
      }
    }
  }

  log(message: string) {
    console.log(message);
    this.#client.bridge.game1.showGlobalMessage(message);
  }

  get client(): APIClient {
    return this.#client;
  }

  get activated(): boolean {
    return this.#activated;
  }
}

export default AutopilotMod;
