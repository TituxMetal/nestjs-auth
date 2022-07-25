export type User = {
  id: string
  email: string
  hash?: string | null
  refreshTokenHash?: string | null
  createdAt?: Date
  updatedAt?: Date
}
