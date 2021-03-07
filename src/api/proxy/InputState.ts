import JSResponseReader from '../core/JSResponseReader';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class InputState extends Proxy<InputState> {
  sub(ref: Ref): InputState {
    return new InputState(ref);
  }

  async pressKey(key: number) {
    this.addPressedKey(key);
    setTimeout(() => this.removePressedKey(key), 1000);
  }

  addPressedKey(key: number) {
    this.ref.run(`GameJS.Input.AddPressedKey(${key})`);
  }

  removePressedKey(key: number) {
    this.ref.run(`GameJS.Input.RemovePressedKey(${key})`);
  }

  async pressLeftButton() {
    this.setLeftButtonPressed(true);
    setTimeout(() => this.setLeftButtonPressed(false), 1000);
  }

  async getLeftButtonPressed(): Promise<boolean> {
    return await this.ref.getPropertyValue('GetMouseState().LeftButton');
  }

  setLeftButtonPressed(LeftButtonPressed: boolean): JSResponseReader {
    return this.ref.run(`GameJS.Input.SimulateLeftButton = ${LeftButtonPressed}`);
  }

  async pressRightButton() {
    this.setRightButtonPressed(true);
    setTimeout(() => this.setRightButtonPressed(false), 1000);
  }

  async getRightButtonPressed(): Promise<boolean> {
    return await this.ref.getPropertyValue('GetMouseState().rightButton');
  }

  setRightButtonPressed(rightButtonPressed: boolean) {
    this.ref.run(`GameJS.Input.SimulateRightButton = ${rightButtonPressed}`);
  }
}

export default InputState;
