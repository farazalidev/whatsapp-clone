import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';

export const getImagesAndVideosFromLoadedFiles = (files: SelectedFileType[]) => {
  const loadedFilesImages: SelectedFileType[] = [];
  files.forEach((file) => {
    if (file.type === 'image' || file.type === 'video' || file.type === 'svg') {
      loadedFilesImages.push(file);
    }
  });
  return loadedFilesImages;
};
