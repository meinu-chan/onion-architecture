import type { PasswordService } from '../../../core/service/password/index.js'
import { randomBytes, timingSafeEqual, scrypt } from 'node:crypto'

const SALT_LENGTH = 20
const KEY_LENGTH = 64

const hash: PasswordService['hash'] = async (rawPassword) => {
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const buf = await scriptPromisify(rawPassword, salt)
  return [buf.toString('hex'), salt].join('.')
}

const compare: PasswordService['compare'] = async (
  incomingPassword: string,
  storedPassword: string
) => {
  const [hashedPassword, salt] = storedPassword.split('.')
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
  const suppliedPasswordBuf = await scriptPromisify(incomingPassword, salt)
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}

function scriptPromisify(rawData: string, salt: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(rawData, salt, KEY_LENGTH, (err, key) =>
      err ? reject(err) : resolve(key)
    )
  )
}

export const passwordService: PasswordService = { hash, compare }
