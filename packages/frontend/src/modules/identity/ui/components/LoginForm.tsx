import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useIdentityContext } from '../../hooks/identity.context';

import { useForm } from '@tanstack/react-form';

import { getOnChangeValidator, getOnSubmit, getTouchedFieldError } from '@/shared/utils/form';
import { emailSchema } from '../../model/email.model';
import { passwordSchema } from '../../model/login.model';


export function LoginForm() {
  const { loginService } = useIdentityContext();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await loginService.login(value.email, value.password);
    },
  });

  return (
    <div>
      <h1>Login</h1>

      <form
        onSubmit={e => { getOnSubmit(e, form); }}
      >
        <form.Field
          name="email"
          validators={getOnChangeValidator(emailSchema)}
        >
          {(field) => (
            <Input
              label="Email"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
							{...getTouchedFieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={getOnChangeValidator(passwordSchema)}
        >
          {(field) => (
            <Input
              label="Password"
              type="password"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
							{...getTouchedFieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <Button
          type="submit"
          disabled={form.state.isSubmitting || !form.state.isValid}
        >
          {form.state.isSubmitting ? 'Loading…' : 'Login'}
        </Button>
      </form>
    </div>
  );
}

