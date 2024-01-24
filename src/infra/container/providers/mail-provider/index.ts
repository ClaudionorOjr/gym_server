import { container } from 'tsyringe'
import { env } from '@infra/env'

import { MailProvider } from '@infra/container/providers/mail-provider/mail-provider'
import { EtherealService } from '@infra/services/mail/ethereal'
import { ResendService } from '@infra/services/mail/resend'

interface MailProviderProps {
  [key: string]: MailProvider
}
const mailProvider: MailProviderProps = {
  ethereal: container.resolve(EtherealService),
  resend: container.resolve(ResendService),
}

container.registerInstance<MailProvider>(
  'MailProvider',
  mailProvider[env.MAIL_PROVIDER],
)
