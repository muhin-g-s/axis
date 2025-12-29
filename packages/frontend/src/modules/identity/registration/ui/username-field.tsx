import { TextField } from '../../base/ui/text-field';

interface UsernameFieldProps {
  error?: string;
  isInvalid?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({
  error,
  isInvalid = false
}) => {
  return (
    <TextField
      id="username"
      name="username"
      label="Username"
      placeholder="Enter your username"
      type="text"
      error={error ?? ''}
      isInvalid={isInvalid}
      required={true}
    />
  );
};
