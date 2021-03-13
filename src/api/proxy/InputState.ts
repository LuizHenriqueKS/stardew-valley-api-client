import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import Vector2 from '../model/Vector2';
import parseVector2 from '../util/parseVector2';

class InputState extends Proxy<InputState> {
  sub(ref: Ref): InputState {
    return new InputState(ref);
  }

  async disableSimulations() {
    await this.ref.invokeMethod('DisableSimulations').next();
  }

  async typeKey(key: number) {
    await this.pressKey(key);
    await this.releaseKey(key);
  }

  async pressKey(key: number) {
    await this.ref.run(`GameJS.Input.AddPressedKey(${key})`).next();
  }

  async releaseKey(key: number) {
    await this.ref.run(`GameJS.Input.RemovePressedKey(${key})`).next();
  }

  async pressLeftButton() {
    await this.setLeftButtonPressed(true);
  }

  async releaseLeftButton() {
    await this.setLeftButtonPressed(false);
  }

  async clickLeftButton() {
    await this.pressLeftButton();
    await this.releaseLeftButton();
  }

  async getLeftButtonPressed(): Promise<boolean> {
    return await this.ref.getPropertyValue('GetMouseState().LeftButton');
  }

  async setLeftButtonPressed(LeftButtonPressed: boolean) {
    await this.ref.run(`GameJS.Input.SimulateLeftButton = ${LeftButtonPressed}`).next();
  }

  async pressRightButton() {
    await this.setRightButtonPressed(true);
  }

  async releaseRightButton() {
    await this.setRightButtonPressed(true);
  }

  async clickRightButton() {
    await this.pressRightButton();
    await this.releaseRightButton();
  }

  async getRightButtonPressed(): Promise<boolean> {
    return await this.ref.getPropertyValue('GetMouseState().rightButton');
  }

  async setRightButtonPressed(rightButtonPressed: boolean) {
    await this.ref.run(`GameJS.Input.SimulateRightButton = ${rightButtonPressed}`).next();
  }

  async getMousePosition(): Promise<Vector2> {
    const result = await this.ref.invokeMethodResult('GetMousePosition');
    return parseVector2(result);
  }

  async simulateMousePosition(x: number, y: number) {
    await this.ref.invokeMethod('SimulateMousePosition', x, y).next();
  }

  async getMousePositionAtTile(): Promise<Vector2> {
    const result = await this.ref.invokeMethodResult('GetMousePositionAtTile');
    return parseVector2(result);
  }

  async simulateMousePositionAtTile(x: number, y: number) {
    await this.ref.invokeMethod('SimulateMousePositionAtTile', x, y).next();
  }
}

export default InputState;
