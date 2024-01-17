export async function getSnapShotOfVideo(videoUrl: string, snapshotTime: number, height: number, width: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a video element
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous'; // Enable cross-origin for CORS support

    // When the video metadata is loaded, set the snapshot time and capture the frame
    video.onloadedmetadata = function () {
      video.currentTime = snapshotTime;
    };

    // When the seeking is complete, capture the frame and resolve the promise
    video.onseeked = function () {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a data URL and resolve the promise
      const thumbnailUrl = canvas.toDataURL();
      resolve(thumbnailUrl);
    };

    // If there's an error loading the video, reject the promise
    video.onerror = function () {
      reject(new Error('Error loading the video.'));
    };
  });
}
