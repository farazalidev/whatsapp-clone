import * as sharp from 'sharp';
import * as fs from 'fs';

interface reduceImageQualityArgs {
  path: string;
  writePath: string;
  shouldRemove: boolean;
  quality: number;
}

type reduceImageQualityFn = (args: reduceImageQualityArgs) => Promise<boolean>;

export const reduceImageQuality: reduceImageQualityFn = async ({ path, shouldRemove, writePath, quality }) => {
  try {
    await sharp(path).jpeg({ quality, force: false }).resize({ width: 56, height: 100 }).toFile(writePath);

    if (shouldRemove) {
      fs.unlinkSync(path);
    }
    return true;
  } catch (error) {
    if (shouldRemove) {
      fs.unlinkSync(path);
    }
    return false;
  }
};
