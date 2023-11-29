declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_ACCESS_TOKEN_SECRET: string;
    NEXT_PUBLIC_REFRESH_TOKEN_SECRET: string;
    NEXT_PUBLIC_ACCESS_TOKEN_NAME: string;
    NEXT_PUBLIC_REFRESH_TOKEN_NAME: string;
    NEXT_PUBLIC_OTP_TOKEN_SECRET: string;
    NEXT_PUBLIC_OTP_TOKEN_NAME: string;
  }
}
