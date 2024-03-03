import { SubscriptionEntity } from '../modules/user/entities/subscription.entity';
import * as webpush from 'web-push';

interface ISendPushNotificationArgs {
  subscription: SubscriptionEntity;
  payload: string | Buffer;
}

type ISendPushNotification = (args: ISendPushNotificationArgs) => Promise<'sended' | 'gone' | 'error'>;

export const sendPushNotification: ISendPushNotification = async ({ payload, subscription }) => {
  try {
    const parsesUrl = new URL(subscription.endpoint);
    const audience = `${parsesUrl.protocol}//${parsesUrl.hostname}`;
    const vapidHeaders = webpush.getVapidHeaders(audience, 'mailto:test@gmail.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY, 'aes128gcm');
    await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { auth: subscription.auth, p256dh: subscription.p256dh } }, payload, {
      headers: vapidHeaders,
    });
    return 'sended';
  } catch (error: any) {
    if (error.statusCode === 404 || error.statusCode === 410) return 'gone';
    else {
      return 'error';
    }
  }
};
