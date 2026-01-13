import { type LoginApi } from '../api/login.api';

export interface AuthSession {
  setToken(value: string): void;
}

export interface ILoginService {
  login(email: string, password: string): Promise<void>;
}

export class LoginService implements ILoginService {
  private static instance: LoginService | null = null;

  private constructor(
    private readonly loginApi: LoginApi,
    private readonly authSession: AuthSession
  ) {}

  static getInstance(
    loginApi: LoginApi,
    authSession: AuthSession
  ): LoginService {
    LoginService.instance ??= new LoginService(loginApi, authSession);

    return LoginService.instance;
  }

  async login(email: string, password: string): Promise<void> {
    const result = await this.loginApi.login({ email, password });
    this.authSession.setToken(result.token);
  }
}
