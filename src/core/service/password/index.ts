export interface PasswordService {
  hash(deserialized: string): Promise<string>
  compare(deserialized: string, serialized: string): Promise<boolean>
}
