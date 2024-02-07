import * as sharp from 'sharp';
import * as fs from 'fs';

interface reduceImageQualityArgs {
  path: string;
  writePath: string;
  shouldRemove: boolean;
  quality: number;
  height: number;
  width: number;
}

type reduceImageQualityFn = (args: reduceImageQualityArgs) => Promise<boolean>;

export const reduceImageQuality: reduceImageQualityFn = async ({ path, shouldRemove, writePath, quality, height, width }) => {
  try {
    await sharp(path)
      .resize({ height: Number(height) || 300, width: Number(width) || 250 })
      .jpeg({ quality, force: true })
      .toFile(writePath);

    if (shouldRemove) {
      fs.unlinkSync(path);
    }
    return true;
  } catch (error) {
    console.log('🚀 ~ constreduceImageQuality:reduceImageQualityFn= ~ error:', error);
    if (shouldRemove) {
      fs.unlinkSync(path);
    }
    return false;
  }
};
