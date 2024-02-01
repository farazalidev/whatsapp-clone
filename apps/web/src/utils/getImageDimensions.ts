export function getImageDimensions(imageUrl: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      resolve(dimensions);
    };

    img.onerror = function (error) {
      reject(error);
    };

    img.src = imageUrl;
  });
}
