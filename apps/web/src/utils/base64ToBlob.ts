export const b64toBlob = async (b64Data: string) => {
  const response = await fetch(b64Data);
  const blob = response.blob();
  return blob;
};
