import APIClient from '../APIClient';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import Character from './Character';
import ChatBox from './ChatBox';
import Farmer from './Farmer';
import GameLocation from './GameLocation';
import InputState from './InputState';

class Game1 extends Proxy<Game1> {
  constructor(arg: Ref | APIClient) {
    super(getRef(arg));
  }

  sub(ref: Ref): Game1 {
    return new Game1(ref);
  }

  async getTimeOfDay(): Promise<number> {
    return await this.ref.getPropertyValue('timeOfDay');
  }

  async getUniqueIDForThisGame(): Promise<number> {
    return await this.ref.getPropertyValue('uniqueIDForThisGame');
  }

  async setUniqueIDForThisGame(uniqueIDForThisGame: number) {
    await this.ref.setPropertyValue('uniqueIDForThisGame', uniqueIDForThisGame).next();
  }

  getCharacterFromName(name: string): Character {
    return new Character(this.ref.getChild(`getCharacterFromName('${name}')`));
  }

  getFarmerById(id: number): Farmer {
    return new Farmer(this.ref.sub(`GameJS.GetFarmerById('${id}')`));
  }

  async pressUseToolButton(): Promise<boolean> {
    return await this.ref.invokeMethodResult('pressUseToolButton');
  }

  async showGlobalMessage(message: string) {
    await this.ref.invokeMethod('showGlobalMessage', message).next();
  }

  async showRedMessage(message: string) {
    await this.ref.invokeMethod('showRedMessage', message).next();
  }

  async getMouseCursorTransparency(): Promise<number> {
    return await this.ref.getPropertyValue('mouseCursorTransparency');
  }

  async setMouseCursorTransparency(mouseCursorTransparency: number) {
    await this.ref.setPropertyValue('mouseCursorTransparency', mouseCursorTransparency).next();
  }

  get player(): Farmer {
    return new Farmer(this.ref.getChild('player'));
  }

  get input(): InputState {
    return new InputState(this.ref.sub('GameJS.Input'));
  }

  get chatBox(): ChatBox {
    return new ChatBox(this.ref.getChild('chatBox'));
  }

  get currentLocation(): GameLocation {
    return new GameLocation(this.ref.getChild('currentLocation'));
  }
}

function getRef(arg: Ref | APIClient): Ref {
  if (arg instanceof Ref) {
    return arg;
  } else {
    return new Ref(arg, 'Game1');
  }
}

export default Game1;
