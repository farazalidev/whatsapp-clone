export const getContentType = (fileExtension: string): string => {
  switch (fileExtension.toLowerCase()) {
    case '.txt':
      return 'text/plain';
    case '.pdf':
      return 'application/pdf';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.mp3':
      return 'audio/mpeg';
    case '.wav':
      return 'audio/wav';
    case '.mp4':
      return 'video/mp4';
    case '.avi':
      return 'video/x-msvideo';
    // Add more cases as needed for different file types
    default:
      return 'application/octet-stream'; // fallback to generic binary data
  }
};
