import { TextField } from '../../base/ui/text-field';

interface UsernameOrEmailFieldProps {
  error?: string;
  isInvalid?: boolean;
  label?: string;
  placeholder?: string;
}

export const UsernameOrEmailField: React.FC<UsernameOrEmailFieldProps> = ({
  error,
  isInvalid = false,
  label = "Username or Email",
  placeholder = "Enter your username or email"
}) => {
  return (
    <TextField
      id="usernameOrEmail"
      name="usernameOrEmail"
      label={label}
      placeholder={placeholder}
      type="text"
      error={error ?? ''}
      isInvalid={isInvalid}
      required={true}
    />
  );
};