import { injectable } from 'tsyringe'
import { MailProvider, MailProps } from '../mail-provider'
import { Resend } from 'resend'

@injectable()
export class ResendService extends Resend implements MailProvider {
  constructor() {
    super(process.env.MAIL_API_KEY)
  }

  async sendMail({ to, subject, path }: MailProps): Promise<void> {
    await this.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to,
      subject,
      html: path,
    })
  }
}
