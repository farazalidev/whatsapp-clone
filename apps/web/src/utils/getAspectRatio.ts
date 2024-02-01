export function getAspectRatio(image: HTMLImageElement) {
  const w = image.naturalWidth;
  console.log('🚀 ~ getAspectRatio ~ w:', w);
  const h = image.naturalHeight;
  console.log('🚀 ~ getAspectRatio ~ h:', h);

  let aspectRatio;

  if (w > h) {
    aspectRatio = w / h;
  } else {
    aspectRatio = h / w;
  }

  return aspectRatio;
}
