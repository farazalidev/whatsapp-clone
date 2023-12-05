import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export async function GET() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  });

  try {
    const url = 'https://res.cloudinary.com/dqgmwfomj/image/authenticated/s--dfKCen85--/v1701340537/whatsapp/file_ipqx3r.jpg';
    const imageData = fs.promises.readFile(url);

    return NextResponse.json(imageData);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
