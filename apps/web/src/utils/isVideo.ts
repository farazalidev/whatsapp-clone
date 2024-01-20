import fileType from 'file-type';
export const isVideo = async (fileUrl: string | undefined): Promise<{ error: boolean }> => {
  try {
    if (fileUrl) {
      const type = await fileType?.fromFile(fileUrl);
      if (type?.mime.startsWith('video/')) {
        return { error: false };
      }
      return { error: true };
    }
    return { error: true };
  } catch (error) {
    return { error: true };
  }
};
