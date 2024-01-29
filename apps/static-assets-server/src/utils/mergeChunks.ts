import * as fs from 'fs';
import { storage } from '../modules/storage/storage';

export const mergeChunks = async (user_id: string, file_id: string, ext: string) => {
  const chunkDir = `${storage.main}${user_id}/attachments-chunks/${file_id}/`;
  const mergedFilePath = `${storage.main}${user_id}/attachments/`;

  if (!fs.existsSync(mergedFilePath)) {
    fs.mkdirSync(mergedFilePath);
  }

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${file_id}${ext}`);
  const files = fs.readdirSync(chunkDir);

  for (const fileName of files) {
    const chunkFilePath = `${chunkDir}${fileName}`;
    const chunkBuffer = await fs.promises.readFile(chunkFilePath);
    writeStream.write(chunkBuffer);
  }

  writeStream.end();

  // Remove the chunks directory
  await fs.promises.rm(chunkDir, { recursive: true });
};
