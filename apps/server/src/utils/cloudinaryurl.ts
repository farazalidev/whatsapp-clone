export function getUrl(public_id: string, format: string) {
  const cloud_name = process.env.CLOUDINARY_NAME;
  return `https://res.cloudinary.com/${cloud_name}/image/upload/${public_id}.${format}`;
}
