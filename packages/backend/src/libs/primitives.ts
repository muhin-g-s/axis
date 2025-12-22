import { type } from 'arktype';

export const PositiveIntSchema = type('number.integer > 0').brand('PositiveInt');
export type PositiveInt = typeof PositiveIntSchema.infer;

export const NonNegativeIntSchema = type('number.integer >= 0').brand('NonNegativeInt');
export type NonNegativeInt = typeof NonNegativeIntSchema.infer;

export const NonEmptyStringSchema = type('string >= 1').brand('NonEmptyString');
export type NonEmptyString = typeof NonEmptyStringSchema.infer;

export const TimestampSchema = type('number.integer >= 0').brand('Timestamp');
export type Timestamp = typeof TimestampSchema.infer;

export const VersionSchema = type('number.integer >= 0').brand('Version');
export type Version = typeof VersionSchema.infer;
