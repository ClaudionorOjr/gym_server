import { injectable } from 'tsyringe'
import {
  MailProvider,
  MailProps,
} from '../../../container/providers/mail-provider/mail-provider'
import { Resend } from 'resend'
import handlebars from 'handlebars'
import fs from 'node:fs'

@injectable()
export class ResendService extends Resend implements MailProvider {
  constructor() {
    super(process.env.MAIL_API_KEY)
  }

  /**
   * Sends an email using the specified mail properties.
   *
   * @param {MailProps} to - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {object} variables - The variables to be used in the email template.
   * @param {string} path - The path to the email template file.
   * @return {Promise<void>} - a Promise that resolves when the email is sent.
   */
  async sendMail({ to, subject, variables, path }: MailProps): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    try {
      await this.emails.send({
        from: 'Gym <no-reply@resend.dev>',
        to,
        subject,
        html: templateHTML,
      })
    } catch (error) {
      console.error('Failed to send email', error)

      throw error
    }
  }
}

//! Posso utilizar o 'reply_to' e adicionar um e-mail ao qual será enviada a resposta do usuários
