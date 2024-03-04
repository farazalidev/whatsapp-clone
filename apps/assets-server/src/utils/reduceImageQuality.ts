import * as sharp from 'sharp';
import * as fs from 'fs';
import { storage } from 'src/modules/storage/storage';

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
    if (shouldRemove) {
      fs.unlinkSync(path);
    }
    return false;
  }
};

interface reduceThumbnailQualityArgs {
  path: string;
  shouldRemove: boolean;
  root_path: string;
  file_name: string;
  ext: string;
}

type reduceThumbnailQualityFn = (args: reduceThumbnailQualityArgs) => Promise<boolean>;

export const reduceThumbnailQuality: reduceThumbnailQualityFn = async ({ path, shouldRemove, root_path, file_name, ext }) => {
  try {
    Promise.all(
      thumbnailImageSizes.map(async (size) => {
        const writePath = `${storage.main}${root_path}${file_name}-thumbnail-${size.suffix}${ext}`;
        await sharp(path).resize(size.width, size.height).jpeg({ quality: 50, force: false }).toFile(writePath);
      }),
    ).then(() => {
      if (shouldRemove) {
        fs.unlinkSync(path);
      }
    });

    return true;
  } catch (error) {
    return false;
  }
};

const thumbnailImageSizes: { width: number; height: number; suffix: 'xs' | 'sm' }[] = [
  { width: 20, height: 20, suffix: 'xs' },
  { width: 80, height: 80, suffix: 'sm' },
];
