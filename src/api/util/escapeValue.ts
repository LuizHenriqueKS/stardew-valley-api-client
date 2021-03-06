import Ref from '../core/Ref';
import jsesc from 'jsesc';
import Proxy from '../core/Proxy';
import EscapedValue from '../model/EscapedValue';

function escapeValue(value: any) {
  if (typeof (value) === 'string') {
    const newValue = jsesc(value);
    return `"${newValue}"`;
  } else if (value instanceof Ref) {
    return value.expression;
  } else if (value instanceof Proxy) {
    return value.ref.expression;
  } else if (value instanceof EscapedValue) {
    return value.value;
  } else {
    return value;
  }
}

export default escapeValue;
