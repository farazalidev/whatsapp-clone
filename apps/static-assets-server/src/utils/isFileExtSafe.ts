import * as FileType from 'file-type';
export const isFileExtSafe = async (filePath: string, extensions: string[], mimeTypes: string[]) => {
  const file = await FileType.fromFile(filePath);
  if (mimeTypes.includes(file?.mime) && extensions.includes(file?.ext)) {
    return true;
  }
  return false;
};
