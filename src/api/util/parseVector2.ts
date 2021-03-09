import Vector2 from '../model/Vector2';

function parseVector2(str: string): Vector2 {
  const values = str.split(',');
  const x = parseInt(values[0].trim());
  const y = parseInt(values[1].trim());
  return { x, y };
}

export default parseVector2;
