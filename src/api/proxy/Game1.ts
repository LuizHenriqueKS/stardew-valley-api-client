import APIClient from '../APIClient';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ChatBox from './ChatBox';
import Farmer from './Farmer';
import InputState from './InputState';

class Game1 extends Proxy<Game1> {
  constructor(arg: Ref | APIClient) {
    super(getRef(arg));
  }

  sub(ref: Ref): Game1 {
    return new Game1(ref);
  }

  getFarmerById(id: number): Farmer {
    return new Farmer(this.ref.sub(`GameJS.GetFarmerById('${id}')`));
  }

  async pressUseToolButton(): Promise<boolean> {
    return await this.ref.invokeMethodResult('pressUseToolButton');
  }

  showGlobalMessage(message: string) {
    this.ref.invokeMethod('showGlobalMessage', message);
  }

  showRedMessage(message: string) {
    this.ref.invokeMethod('showRedMessage', message);
  }

  async getMouseCursorTransparency(): Promise<number> {
    return await this.ref.getPropertyValue('mouseCursorTransparency');
  }

  setMouseCursorTransparency(mouseCursorTransparency: number): void {
    this.ref.setPropertyValue('mouseCursorTransparency', mouseCursorTransparency);
  }

  setMousePosition(x: number, y: number): void {
    this.ref.invokeMethod('setMousePosition', x, y);
  }

  get player(): Farmer {
    return new Farmer(this.ref.getChild('player'));
  }

  get input(): InputState {
    return new InputState(this.ref.getChild('input'));
  }

  get chatBox(): ChatBox {
    return new ChatBox(this.ref.getChild('chatBox'));
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
