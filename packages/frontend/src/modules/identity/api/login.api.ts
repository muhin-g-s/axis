import { type LoginPayload, type LoginResponse } from '../model/login.model';

export interface IHttpClient {
  post<T>(url: string, body: unknown): Promise<T>;
}

export interface ILoginApi {
  login(payload: LoginPayload): Promise<LoginResponse>;
}

export class LoginApi implements ILoginApi {
  private readonly httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/api/auth/sign-in', payload);
  }
}
