export function isIamReceiver(chat_with_user_id: string | undefined, my_user_id: string | undefined) {
  return chat_with_user_id === my_user_id;
}
