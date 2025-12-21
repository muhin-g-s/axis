import { type } from 'arktype';
import { v4 as uuidv4 } from 'uuid';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const UuidString = type('string').narrow((s, ctx) => {
  if (!uuidPattern.test(s)) {
    ctx.mustBe('a valid UUID v4');
    return false;
  }
  return true;
});

type Branded<T, Brand> = T & {
  readonly " brand": [string, Brand];
};

export function createId<Brand>(): Branded<string, Brand> {
  return uuidv4() as  Branded<string, Brand>;
}

export type IdSchema<Brand extends string> = ReturnType<
  typeof UuidString.brand<Brand>
>;

export function createIdSchema<Brand extends string>(brand : Brand): IdSchema<Brand> {
  return UuidString.brand(brand)
}
 