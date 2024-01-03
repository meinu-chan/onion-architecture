import { injectable } from 'inversify'
import type { PasswordService as PasswordServiceAbstraction } from './index.js'
import { randomBytes, timingSafeEqual, scrypt } from 'node:crypto'

@injectable()
export class PasswordService implements PasswordServiceAbstraction {
  public async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex')
    const buf = await this.scriptPromisify(password, salt)

    return [buf.toString('hex'), salt].join('.')
  }

  public async compare(
    incomingPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.')
    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
    const suppliedPasswordBuf = await this.scriptPromisify(
      incomingPassword,
      salt
    )

    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
  }

  private scriptPromisify(data: string, salt: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) =>
      scrypt(data, salt, 64, (err, key) => (err ? reject(err) : resolve(key)))
    )
  }
}
