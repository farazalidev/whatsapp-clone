import { ResponseType, SuccessResponse } from '../Misc/ResponseType.type';
import { isSuccess } from './isSuccess.typeguard';
import { HttpException } from '@nestjs/common';

export function sendResponse(response: ResponseType): SuccessResponse {
  if (!isSuccess(response)) {
    throw new HttpException(response.error.message, response.error.statusCode);
  }
  return {
    message: response.successMessage,
    success: response.success,
  };
}
