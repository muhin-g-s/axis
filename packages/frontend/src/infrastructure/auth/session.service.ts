export interface AuthSession {
  setToken(value: string): void;
  getToken(): string | null;
}

let token: string | null = null;

export const authSession = {
  setToken(value: string): void {
    token = value;
  },
  getToken(): string | null {
    return token;
  },
} as const satisfies AuthSession;
