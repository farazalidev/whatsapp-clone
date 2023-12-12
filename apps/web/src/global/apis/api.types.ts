export interface RegisterUser {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface VerifyUserPayload {
  registration_otp: string;
}

export type CompleteProfileBody = {
  pic_path: string;
  about: string;
};
