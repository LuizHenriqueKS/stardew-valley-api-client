import fs from 'fs';

function readJSON(path: string) {
  const content = fs.readFileSync(path).toString();
  const result = JSON.parse(content);
  return result;
}

export default readJSON;
