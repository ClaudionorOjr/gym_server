export interface MailProps {
  to: string
  subject: string
  variables: Record<string, unknown>
  path: string
}

export interface MailProvider {
  sendMail(data: MailProps): Promise<void>
}
