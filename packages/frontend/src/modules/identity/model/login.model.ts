import { type } from "arktype";

export interface LoginPayload {
  email: string;
  password: string;
};

export interface LoginResponse {
  token: string;
};

export const passwordSchema = type('string>=8');
