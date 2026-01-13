import { type } from "arktype";

export const emailSchema = type('string.email').configure({
  message: 'Форма заполнена некорректно',
});
