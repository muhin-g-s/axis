import { match } from 'ts-pattern';

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },

  err<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },

  isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
    return result.ok;
  },

  isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
    return !result.ok;
  },

  map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    return match(result)
      .with({ ok: true }, ({ value }) => Result.ok(fn(value)))
      .with({ ok: false }, (r) => r)
      .exhaustive();
  },

  mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    return match(result)
      .with({ ok: true }, (r) => r)
      .with({ ok: false }, ({ error }) => Result.err(fn(error)))
      .exhaustive();
  },

  unwrap<T, E>(result: Result<T, E>): T {
    return match(result)
      .with({ ok: true }, ({ value }) => value)
      .with({ ok: false }, ({ error }) => {
        throw new Error(`Unwrap called on Err: ${String(error)}`);
      })
      .exhaustive();
  },

  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    return match(result)
      .with({ ok: true }, ({ value }) => value)
      .with({ ok: false }, () => defaultValue)
      .exhaustive();
  },
} as const;
