import JSResponseReader from '../core/JSResponseReader';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class SaveGame extends Proxy<SaveGame> {
  sub(ref: Ref): SaveGame {
    return new SaveGame(ref);
  }

  saveNewGame(): JSResponseReader {
    const script = `
      const tmp = new Date().getTime();
      Game1.uniqueIDForThisGame = tmp;
      const x = SaveGame.Save(); 
      while(x.MoveNext()) {}; 
      return true;
    `;
    return this.ref.client.jsRunner.run(script);
  }

  save(): JSResponseReader {
    const script = `
      const x = SaveGame.Save(); 
      while(x.MoveNext()) {}; 
      return true;
    `;
    return this.ref.client.jsRunner.run(script);
  }
}

export default SaveGame;
