import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import dayjs from 'dayjs';

export const getMaxDate = (messages: MessageEntity[]) => {
  if (!messages) return;
  const timeStamps = messages?.map((message) => Date.parse(message.sended_at as any));
  const maxDate = Math.max(...timeStamps);
  console.log(dayjs(maxDate).format('hh:mm A'));
};
