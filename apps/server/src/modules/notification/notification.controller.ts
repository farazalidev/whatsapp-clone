import { Body, Controller, Post, Res } from '@nestjs/common';
import { NotificationService } from './notification.service';
import * as webpush from 'web-push';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../user/entities/subscription.entity';
import { Repository } from 'typeorm';

@Controller()
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    @InjectRepository(SubscriptionEntity) private SubsRepo: Repository<SubscriptionEntity>,
    @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() body: { endpoint: string; auth: string; p256dh: string }, @Res() res: Response, @GetUser() user: UserEntity) {
    try {
      webpush.setVapidDetails('mailto:test@gmail.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
      const subsExists = await this.SubsRepo.existsBy({ user: { user_id: user.user_id } });
      if (subsExists) {
        await this.SubsRepo.update({ user: { user_id: user.user_id } }, { auth: body.auth, endpoint: body.endpoint, p256dh: body.p256dh });
        return res.status(201).json({ status: 'success' });
      }
      const newSubscription = this.SubsRepo.create({
        auth: body.auth,
        endpoint: body.endpoint,
        p256dh: body.p256dh,
        user: user,
      });
      await this.SubsRepo.save(newSubscription);
      res.status(201).json({ status: 'success' });
    } catch (error) {
      console.log(error);
    }
  }
}
