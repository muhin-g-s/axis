import { type Type, type } from "arktype";
import { type TargetedSubmitEvent } from "preact";

interface Value {
	value: string
}

type ErrorTextOrUndefined = string | undefined;

interface OnChangeValidator {
	onChange: (value: Value) => ErrorTextOrUndefined
}

export function getOnChangeValidator<TSchema>(schema: Type<TSchema>): OnChangeValidator {
	return {
		onChange: (value: Value): ErrorTextOrUndefined => getErrorOrUndefined(schema, value),
	}
}

function getErrorOrUndefined<TSchema>(schema: Type<TSchema>, data: Value): ErrorTextOrUndefined {
	const result = schema(data.value);
	if (result instanceof type.errors) {
		return result.summary;
	}
	return undefined;
}

interface FieldMeta {
  isTouched: boolean;
  errors: unknown[];
}

export function getTouchedFieldError(meta: FieldMeta): { error: string } | object {
  if (!meta.isTouched) {
    return {};
  }

  return {
    error: meta.errors.join(', '),
  };
}

interface Form {
	handleSubmit: () => Promise<void>;
}

export function getOnSubmit(e: TargetedSubmitEvent<HTMLFormElement>, form: Form): void {
	e.preventDefault();
	e.stopPropagation();
	void form.handleSubmit();
}
