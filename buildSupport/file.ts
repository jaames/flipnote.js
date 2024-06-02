import fs from 'fs';
import path from 'path';

export const writeFile = (filePath: string, fileData: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, fileData);
};

export const cleanDir = (directoryPath: string) => {
  const abs = path.resolve(directoryPath);
  try {
    for (const file of fs.readdirSync(abs)) {
      const filePath = path.join(abs, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory())
        cleanDir(filePath);
      if (stat.isFile())
        fs.unlinkSync(filePath);
    }
  }
  catch (e) { }
};