import EventHandler from '../core/EventHandler';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ButtonPressedEvent from '../event/ButtonPressedEvent';
import ButtonReleasedEvent from '../event/ButtonReleasedEvent';

class InputEvents extends Proxy<InputEvents> {
  sub(ref: Ref): InputEvents {
    return new InputEvents(ref);
  }

  get buttonPressed(): EventHandler<ButtonPressedEvent> {
    return new EventHandler<ButtonPressedEvent>(this, 'ButtonPressed');
  }

  get buttonReleased(): EventHandler<ButtonReleasedEvent> {
    return new EventHandler<ButtonReleasedEvent>(this, 'ButtonReleased');
  }
}

export default InputEvents;
