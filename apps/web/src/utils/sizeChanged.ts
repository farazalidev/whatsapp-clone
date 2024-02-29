export const sizeChanged = (prevSize: number | undefined, newSize: number | undefined, newSizeCallback: (newSize: number, changedSize: number) => void) => {
  if (newSize && prevSize) {
    if (newSize > prevSize) {
      return newSizeCallback(newSize, newSize - prevSize);
    }
    return;
  }
  return;
};
