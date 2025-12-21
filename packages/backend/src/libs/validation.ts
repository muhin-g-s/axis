import { type, type Type } from 'arktype';
import { Result } from './result';

export function validate<TSchema, TError = unknown>(
	schema: Type<TSchema>,
	data: unknown,
	creator: (msg: string) => TError
): Result<typeof schema.infer, TError> {
  const result = schema(data);

  if (result instanceof type.errors) {
    return Result.err(creator(result.summary));
  }

  return Result.ok(result);
}
