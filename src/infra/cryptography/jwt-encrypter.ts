import { injectable } from 'tsyringe'
import { env } from '@infra/env'
import { Encrypter } from '@account/cryptography/encrypter'
import jwt from 'jsonwebtoken'

@injectable()
export class JwtEncrypter implements Encrypter {
  /**
   * Encrypts the given payload using JSON Web Token (JWT).
   *
   * @param {Record<string, unknown>} payload - The payload to be encrypted.
   * @return {Promise<string>} The encrypted payload as a string.
   */
  async encrypt(
    payload: Record<string, unknown>,
    expiresIn?: string,
  ): Promise<string> {
    return jwt.sign(payload, Buffer.from(env.JWT_PRIVATE_KEY, 'base64'), {
      algorithm: 'RS256',
      expiresIn: expiresIn ?? '1d',
    })
  }

  async verify(token: string): Promise<string | Record<string, unknown>> {
    return jwt.verify(token, Buffer.from(env.JWT_PRIVATE_KEY, 'base64'), {
      algorithms: ['RS256'],
    })
  }
}
