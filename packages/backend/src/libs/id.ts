import { type Type, type } from 'arktype';
import { v4 as uuidv4 } from 'uuid';
import { validate } from './validation';
import { createInvalidIdFormatError, type InvalidIdFormatError } from './error';
import type { Result } from './result';
import type { Brand } from '@ark/util';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const UuidStringSchema = type('string').narrow((s, ctx) => {
  if (!uuidPattern.test(s)) {
    ctx.mustBe('a valid UUID v4');
    return false;
  }
  return true;
});

export function createId<B extends string>(): Brand<string, B> {
  return uuidv4() as  Brand<string, B>;
}

export type IdSchema<Brand extends string> = ReturnType<
  typeof UuidStringSchema.brand<Brand>
>;

export function createIdSchema<Brand extends string>(brand : Brand): IdSchema<Brand> {
  return UuidStringSchema.brand(brand)
}

type BrandedSchema<T> = Type<Brand<string, T>>
type Return<BrandId> = Result<Brand<string, BrandId>, InvalidIdFormatError>

export function fromStringFactory<BrandId>(schema: BrandedSchema<BrandId>): (id: string) => Return<BrandId> {
	return function (id: string): Return<BrandId> {
		return validate<Brand<string, BrandId>,InvalidIdFormatError>(
			schema,
			id,
			msg => createInvalidIdFormatError(id, msg)
		);
	};
}
