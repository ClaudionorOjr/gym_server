import { MailProps, MailProvider } from '@infra/services/mail/mail-provider'

export class InMemoryMailProvider implements MailProvider {
  public message: MailProps[] = []

  async sendMail({ to, subject, variables, path }: MailProps): Promise<void> {
    this.message.push({ to, subject, variables, path })
  }
}
