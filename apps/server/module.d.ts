declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_NAME: string;
    REFRESH_TOKEN_NAME: string;
    OTP_TOKEN_SECRET: string;
    OTP_TOKEN_NAME: string;
    CLOUDINARY_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
