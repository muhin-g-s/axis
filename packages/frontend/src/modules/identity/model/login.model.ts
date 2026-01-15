import { type } from "arktype";

export interface LoginPayload {
  email: string;
  password: string;
};

export interface LoginResponse {
  email: string;
	username: string;
	id: string;
};

export const passwordSchema = type('string>=8');
