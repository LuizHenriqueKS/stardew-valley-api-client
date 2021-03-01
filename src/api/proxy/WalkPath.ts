import JSResponseReader from '../core/JSResponseReader';
import WalkingEvent from '../event/WalkingEvent';
import Position from '../model/Position';
import Vector2 from '../model/Vector2';
import Character from './Character';

class WalkPath {
  #path: Vector2[];
  #character: Character;
  #moving: boolean;
  #finished: boolean;

  constructor(character: Character, path: Vector2[]) {
    this.#path = path.map(s => this.parseVector2(s));
    this.#character = character;
    this.#moving = false;
    this.#finished = false;
  }

  cancel() {
    this.#moving = false;
  }

  async move(eachStep?: (evt: WalkingEvent, path: WalkPath) => Promise<boolean>): Promise<WalkingEvent> {
    this.#moving = true;
    this.#finished = false;
    const reader = this.startMoving();
    let evt: WalkingEvent;
    do {
      evt = (await reader.next()).result;
      if (evt.finished) {
        this.#moving = false;
      } else if (eachStep) {
        this.#moving = await eachStep(evt, this);
      }
    } while (this.#moving);
    this.#finished = evt.finished;
    return evt;
  }

  stop() {
    const script = `GameJS.GetWalker(${this.#character.ref.expression}).Stop(request)`;
    return this.#character.ref.run(script);
  }

  private startMoving(): JSResponseReader {
    const path = this.#path.map(p => `${p.x}:${p.y}`).join(',');
    const script = `GameJS.GetWalker(${this.#character.ref.expression}).Walk(request, '${path}')`;
    return this.#character.ref.run(script);
  }

  private parseVector2(str: string | Vector2): Vector2 {
    if (str instanceof Vector2) {
      return str;
    }
    const values = str.split(',').map(i => parseInt(i.trim()));
    const position = new Position();
    position.x = values[0];
    position.y = values[1];
    return position;
  }

  get finished(): boolean {
    return this.#finished;
  }
}

export default WalkPath;
