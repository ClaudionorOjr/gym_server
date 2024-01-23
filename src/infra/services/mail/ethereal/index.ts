import { injectable } from 'tsyringe'
import { MailProvider, MailProps } from '../mail-provider'
import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'node:fs'

@injectable()
export class EtherealService implements MailProvider {
  private client!: Transporter

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })

        this.client = transporter
      })
      .catch((err) => {
        console.error('Failed to create a SMTP transporter ', err)
      })
  }

  /**
   * Sends an email.
   *
   * @param {MailProps} MailProps - The email properties.
   * @param {string} MailProps.to - The recipient of the email.
   * @param {string} MailProps.subject - The subject of the email.
   * @param {string} MailProps.path - The path to the email content.
   * @return {Promise<void>} - A promise that resolves when the email is sent successfully.
   */
  async sendMail({ to, subject, variables, path }: MailProps): Promise<void> {
    //* Transformando o conteúdo do arquivo para string.
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    const message = await this.client.sendMail({
      from: 'Test <Q1oB1@example.com>',
      to,
      subject,
      html: templateHTML,
    })

    console.log('Message sent: %s', message.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}
