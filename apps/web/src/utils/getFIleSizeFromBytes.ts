export function convertFileSizeFromBytes(sizeInBytes: number, separator: string = '~') {
  if (sizeInBytes < 102400) {
    // 100 KB in bytes
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return `${separator} ${sizeInKB} Kb`;
  } else {
    const sizeInMB = (sizeInBytes / 1024 ** 2).toFixed(2);
    return `${separator} ${sizeInMB} Mb`;
  }
}
