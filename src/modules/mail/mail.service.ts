import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_EMITTER } from 'src/common/constants/event-emitter.constant';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(EVENT_EMITTER.MAIL_SEND)
  sendMail(mail: ISendMailOptions) {
    console.log('Sending mail...', mail);

    const from = this.configService.get('MAIL_FROM');
    this.mailerService.sendMail({ ...mail, from });
  }
}
