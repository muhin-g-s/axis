import { Box } from "@chakra-ui/react";
import { BaseForm } from '../../base/ui/base-form';
import { BaseButton } from '../../base/ui/base-button';
import { UsernameField } from './username-field';
import { EmailField } from './email-field';
import { PasswordField } from './password-field';

interface RegistrationFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const RegistrationForm = ({
  onSubmit = () => { /* fallback */ },
  isLoading = false
}: RegistrationFormProps) => {
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <BaseForm onSubmit={handleSubmit}>
      <UsernameField />
      <EmailField />
      <PasswordField />

      <BaseButton type="submit" isLoading={isLoading}>
        Create Account
      </BaseButton>

      <Box
        fontSize="sm"
        color="token(colors.blue.600)"
        textAlign="center"
        mt="2"
      >
        <a href="/login" style={{ textDecoration: 'underline', color: 'inherit' }}>
          Already have an account? Sign in
        </a>
      </Box>
    </BaseForm>
  );
};
