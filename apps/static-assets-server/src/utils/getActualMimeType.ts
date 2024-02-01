import * as fileType from 'file-type';
export const getActualMimeType = async (path: string) => {
  const { mime } = await fileType.fromFile(path);
  return mime;
};
