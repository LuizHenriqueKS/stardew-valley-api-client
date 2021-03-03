import EventHandler from '../core/EventHandler';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ChatMessageEvent from '../event/ChatMessageEvent';

class ChatEvents extends Proxy<ChatEvents> {
  sub(ref: Ref): ChatEvents {
    return new ChatEvents(ref);
  }

  get chatMessageReceived(): EventHandler<ChatMessageEvent> {
    return new EventHandler<ChatMessageEvent>(this, 'ChatMessageReceived');
  }
}
export default ChatEvents;
