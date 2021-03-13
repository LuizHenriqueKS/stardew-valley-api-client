import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class SaveGame extends Proxy<SaveGame> {
  sub(ref: Ref): SaveGame {
    return new SaveGame(ref);
  }

  async saveNewGame() {
    const script = `
      const tmp = new Date().getTime();
      Game1.uniqueIDForThisGame = tmp;
      const x = SaveGame.Save(); 
      while(x.MoveNext()) {}; 
      return true;
    `;
    await this.ref.client.jsRunner.run(script).next();
  }

  async save() {
    const script = `
      const x = SaveGame.Save(); 
      while(x.MoveNext()) {}; 
      return true;
    `;
    await this.ref.client.jsRunner.run(script).next();
  }
}

export default SaveGame;
