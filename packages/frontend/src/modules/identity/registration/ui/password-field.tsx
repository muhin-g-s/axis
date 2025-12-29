import { TextField } from '../../base/ui/text-field';

interface PasswordFieldProps {
  error?: string;
  isInvalid?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  error,
  isInvalid = false
}) => {
  return (
    <TextField
      id="password"
      name="password"
      label="Password"
      placeholder="Create a password"
      type="password"
      error={error ?? ''}
      isInvalid={isInvalid}
      required={true}
      minLength={6}
    />
  );
};
