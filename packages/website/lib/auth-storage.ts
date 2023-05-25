type Auth = {
  user_id: number
  access_token: string
  refresh_token: string
  expires_in: number
}

const store: Record<string, Auth> = {}

export function hasItem(key: string): boolean {
  return key in store
}

export function setItem(key: string, value: Auth): void {
  store[key] = value

  setTimeout(() => {
    removeItem(key)
  }, 10 * 1000)
}

export function getItem(key: string): Auth | undefined {
  return store[key]
}

export function removeItem(key: string): void {
  delete store[key]
}
