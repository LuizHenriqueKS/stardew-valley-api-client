import Ref from '../core/Ref';
import jsesc from 'jsesc';

function escapeValue(value: any) {
  if (typeof (value) === 'string') {
    const newValue = jsesc(value);
    return `"${newValue}"`;
  } else if (value instanceof Ref) {
    return value.expression;
  } else {
    return value;
  }
}

export default escapeValue;
