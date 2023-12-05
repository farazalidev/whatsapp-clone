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
  profile_pic: {
    public_id: string;
    format: string;
  };
  name: string;
  about: string;
};
