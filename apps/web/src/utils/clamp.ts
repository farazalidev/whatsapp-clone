export const clampString = (data: string, maxLength: number) => {
  if (data?.length > maxLength) {
    return `${data.slice(0, maxLength)}...`;
  }
  return data;
};
