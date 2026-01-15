import { type LoginPayload, type LoginResponse } from '../model/login.model';

export interface LoginApi {
  login(payload: LoginPayload): Promise<LoginResponse>;
}
