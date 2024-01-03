import dayjs from 'dayjs';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export function getDayOrFormattedDate(messages: MessageEntity[]): string {
  if (!messages || messages.length === 0) return '';

  const message = messages?.reduce((a, b) => {
    return new Date(a.sended_at) > new Date(a.sended_at) ? a : b;
  });

  const date = dayjs(message.sended_at);
  const today = dayjs();

  // Check if the date is within the last 12 hours
  if (date.isAfter(today.subtract(12, 'hour'))) {
    return date.format('hh:mm A'); // Show time in hh:mm AM/PM format
  } else if (date.isSame(today, 'day')) {
    return 'Today';
  } else if (date.isSame(today.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  } else if (date.isSame(today, 'week')) {
    // If the date is within the current week, show the day
    return date.format('dddd');
  } else {
    // If the date is not recent and not in the current week, format it as "DD/MM/YY"
    return date.format('DD/MM/YY');
  }
}
