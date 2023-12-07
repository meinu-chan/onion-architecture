import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

function scriptPromisify(data: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(data, salt, 64, (err, key) => (err ? reject(err) : resolve(key)))
  )
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const buf = await scriptPromisify(password, salt)

  return [buf.toString('hex'), salt].join('.')
}

export async function comparePassword(
  incomingPassword: string,
  storedPassword: string
): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.')
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
  const suppliedPasswordBuf = await scriptPromisify(incomingPassword, salt)

  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}
