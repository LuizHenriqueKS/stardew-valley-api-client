import fs from 'fs';

function writeJSON(file: string, json: any) {
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
}

export default writeJSON;
