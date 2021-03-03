import JSResponseReader from '../core/JSResponseReader';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class ChatBox extends Proxy<ChatBox> {
  sub(ref: Ref): ChatBox {
    return new ChatBox(ref);
  }

  addInfoMessage(message: string): JSResponseReader {
    return this.ref.invokeMethod('addInfoMessage', message);
  }

  addErrorMessage(message: string): JSResponseReader {
    return this.ref.invokeMethod('addErrorMessage', message);
  }
}

export default ChatBox;
