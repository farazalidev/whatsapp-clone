// pages/api/images/[imageId].js

import { v2 as cloudinary } from 'cloudinary';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

cloudinary.config({
  cloud_name: serverRuntimeConfig.CLOUDINARY_CLOUD_NAME,
  api_key: serverRuntimeConfig.CLOUDINARY_API_KEY,
  api_secret: serverRuntimeConfig.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  const { imageId } = req.query;

  try {
    const result = await cloudinary.api.resource(imageId);
    const imageUrl = cloudinary.url(imageId, { secure: true });

    // You can set additional headers here if needed
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
