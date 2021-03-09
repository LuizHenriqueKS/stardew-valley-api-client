import JSResponseReader from '../core/JSResponseReader';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import Vector2 from '../model/Vector2';
import parseVector2 from '../util/parseVector2';
import sleep from '../util/sleep';

class InputState extends Proxy<InputState> {
  sub(ref: Ref): InputState {
    return new InputState(ref);
  }

  disableSimulations(): JSResponseReader {
    return this.ref.invokeMethod('DisableSimulations');
  }

  async pressKey(key: number) {
    this.addPressedKey(key);
    setTimeout(() => this.removePressedKey(key), 1000);
  }

  addPressedKey(key: number): JSResponseReader {
    return this.ref.run(`GameJS.Input.AddPressedKey(${key})`);
  }

  removePressedKey(key: number): JSResponseReader {
    return this.ref.run(`GameJS.Input.RemovePressedKey(${key})`);
  }

  async pressLeftButton(release: boolean = true) {
    await this.setLeftButtonPressed(true).next();
    // await sleep(300);
    if (release) {
      await this.setLeftButtonPressed(false).next();
      // new Game1(this.ref.client).player.endUsingTool();
      // await sleep(300);
    }
  }

  async releaseLeftButton() {
    await this.setLeftButtonPressed(false).next();
    await sleep(300);
  }

  async getLeftButtonPressed(): Promise<boolean> {
    return await this.ref.getPropertyValue('GetMouseState().LeftButton');
  }

  setLeftButtonPressed(LeftButtonPressed: boolean): JSResponseReader {
    return this.ref.run(`GameJS.Input.SimulateLeftButton = ${LeftButtonPressed}`);
  }

  async pressRightButton() {
    await this.setRightButtonPressed(true).next();
    await sleep(300);
    await this.setRightButtonPressed(false).next();
    await sleep(300);
  }

  async getRightButtonPressed(): Promise<boolean> {
    return await this.ref.getPropertyValue('GetMouseState().rightButton');
  }

  setRightButtonPressed(rightButtonPressed: boolean): JSResponseReader {
    return this.ref.run(`GameJS.Input.SimulateRightButton = ${rightButtonPressed}`);
  }

  async getMousePosition(): Promise<Vector2> {
    const result = await this.ref.invokeMethodResult('GetMousePosition');
    return parseVector2(result);
  }

  simulateMousePosition(x: number, y: number): JSResponseReader {
    return this.ref.invokeMethod('SimulateMousePosition', x, y);
  }

  async getMousePositionAtTile(): Promise<Vector2> {
    const result = await this.ref.invokeMethodResult('GetMousePositionAtTile');
    return parseVector2(result);
  }

  simulateMousePositionAtTile(x: number, y: number): JSResponseReader {
    return this.ref.invokeMethod('SimulateMousePositionAtTile', x, y);
  }
}

export default InputState;
