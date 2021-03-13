import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class ChatBox extends Proxy<ChatBox> {
  sub(ref: Ref): ChatBox {
    return new ChatBox(ref);
  }

  async addInfoMessage(message: string) {
    await this.ref.invokeMethod('addInfoMessage', message).next();
  }

  async addErrorMessage(message: string) {
    await this.ref.invokeMethod('addErrorMessage', message).next();
  }
}

export default ChatBox;
