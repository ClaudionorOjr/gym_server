import { Encrypter } from '@account/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    const serializedPayload = JSON.stringify(payload)
    return Buffer.from(serializedPayload).toString('base64')
  }

  async verify(token: string): Promise<string | Record<string, unknown>> {
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decodedToken)
  }
}
