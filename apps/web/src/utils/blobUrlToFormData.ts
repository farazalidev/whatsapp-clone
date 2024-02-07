import { extname } from 'path';

export const BlobUrlToFormData = async (blobUrl: string, fieldName: string, fileName: string) => {
  console.log('🚀 ~ BlobUrlToFormData ~ fileName:', extname(fileName));
  const response = await fetch(blobUrl);
  const fmData = new FormData();
  const resBlob = await response?.blob();
  console.log('🚀 ~ BlobUrlToFormData ~ resBlob:', resBlob);
  console.log(fieldName);

  fmData.append(fieldName, resBlob, extname(fileName));
  return fmData;
};
