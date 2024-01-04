export interface PasswordService {
  hash(rawPassword: string): Promise<string>
  compare(rawPassword: string, hashed: string): Promise<boolean>
}
