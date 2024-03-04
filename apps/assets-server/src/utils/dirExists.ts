import * as fs from 'fs';

export const dirExists = (dir: string) => {
  try {
    const isExisted = fs.existsSync(dir);
    return isExisted;
  } catch (error) {
    return false;
  }
};
