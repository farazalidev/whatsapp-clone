export type ResponseType<TData = any> =
  | {
      success: true;
      data?: TData;
      successMessage: string;
    }
  | {
      success: false;
      error: { message: string; statusCode: number };
    };

export type SuccessResponse = {
  success: true;
  message: string;
};

export type SuccessResponseType<TData = any> = {
  success: true;
  data?: TData;
  successMessage: string;
};
