import { expectedFileTypes } from '@/global/context/reducers/filesReducer';

export interface GetFileUrlReturnType {
  url: string | undefined;
  type: expectedFileTypes;
  size: number;
}

export const getFileUrl = (file: File | undefined): GetFileUrlReturnType => {
  // if the file is an image
  if (file) {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      return {
        type: 'image',
        url,
        size: file.size,
      };
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      return {
        type: 'video',
        url,
        size: file.size,
      };
    } else {
      return {
        type: 'others',
        url: undefined,
        size: file.size,
      };
    }
  }
  return {
    type: null,
    url: undefined,
    size: 0,
  };
};
