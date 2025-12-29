import { TextField } from '../../base/ui/text-field';

interface EmailFieldProps {
  error?: string;
  isInvalid?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  error,
  isInvalid = false
}) => {
  return (
    <TextField
      id="email"
      name="email"
      label="Email"
      placeholder="Enter your email"
      type="email"
      error={error ?? ''}
      isInvalid={isInvalid}
      required={true}
    />
  );
};
