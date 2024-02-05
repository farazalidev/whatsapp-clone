export function createFileChunk(file: File, startByte: number, chunkSize: number) {
  const size = chunkSize * 1024 * 1024;
  const endByte = Math.min(startByte + size, file.size);
  const chunk = file.slice(startByte, endByte);
  return new Blob([chunk], { type: file.type });
}
