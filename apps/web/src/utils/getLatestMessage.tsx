import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export function getLatestMessage(messages: MessageEntity[]) {
  // Assuming each message has a 'timestamp' property
  const sortedMessages = messages.slice().sort((a, b) => {
    const timestampA = new Date(a.sended_at).getTime();
    const timestampB = new Date(b.sended_at).getTime();
    return timestampB - timestampA; // Sorting in descending order (latest first)
  });

  // Return the first element of the sorted array (which is the latest message)
  return sortedMessages[0];
}
