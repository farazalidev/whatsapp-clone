import { expectedFileTypes } from '@/global/context/reducers/filesReducer';

export interface GetFileUrlReturnType {
  url: string | undefined;
  type: expectedFileTypes;
}

export const getFileUrl = (file: File | undefined): GetFileUrlReturnType => {
  // if the file is an image
  if (file) {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      return {
        type: 'image',
        url,
      };
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      return {
        type: 'video',
        url,
      };
    } else {
      return {
        type: 'others',
        url: undefined,
      };
    }
  }
  return {
    type: null,
    url: undefined,
  };
};
