export const splitFileIntoChunks = (file: File, startChunkIndex = 0) => {
  const totalChunks = Math.ceil(file.size / (2 * 1024 * 1024));
  const chunkSize = Math.ceil(file.size / totalChunks);

  const chunks = [];

  // Splitting file into chunks starting from the specified index
  for (let i = startChunkIndex; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = (i + 1) * chunkSize;
    chunks.push(file.slice(start, end));
  }

  return { totalChunks, chunkSize, chunks };
};
