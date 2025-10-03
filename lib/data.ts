import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');

export function readData() {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

export function writeData(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
