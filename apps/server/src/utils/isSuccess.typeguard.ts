import { ResponseType } from '../Misc/ResponseType.type';

export function isSuccess(response: ResponseType): response is { success: true; successMessage: string } {
  return response?.success === true;
}
