import { extname } from 'path';

export const BlobUrlToFormData = async (blobUrl: string, fieldName: string, fileName: string) => {
  const response = await fetch(blobUrl);
  const fmData = new FormData();
  const resBlob = await response?.blob();

  fmData.append(fieldName, resBlob, extname(fileName));
  return fmData;
};
