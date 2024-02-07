export async function getSnapShotOfVideoBlob(
  videoUrl: string,
  snapshotTime: number,
  width: number,
  height: number,
): Promise<{ blob: Blob; file: File; width: number; height: number }> {
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
      const aspectRatio = video.videoWidth / video.videoHeight;
      const width = 300; // You can set a default width here
      const height = width / aspectRatio;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'snapshot.png', { type: 'image/png' });
            resolve({ blob, file, width, height: Math.round(height) });
          } else {
            reject(new Error('Error creating Blob from canvas.'));
          }
        },
        'image/png', // Specify the image format here, e.g., 'image/jpeg' or 'image/png'
        0.1, // Quality parameter for 'image/jpeg', ignored for other formats
      );
    };

    // If there's an error loading the video, reject the promise
    video.onerror = function () {
      reject(new Error('Error loading the video.'));
    };
  });
}
