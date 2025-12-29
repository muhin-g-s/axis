import { Box } from "@chakra-ui/react";
import { BaseForm } from '../../base/ui/base-form';
import { BaseButton } from '../../base/ui/base-button';
import { UsernameOrEmailField } from './username-or-email-field';
import { PasswordField } from '../../registration/ui/password-field';

interface LoginFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const LoginForm = ({
  onSubmit = () => { /* fallback */ },
  isLoading = false
}: LoginFormProps) => {
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <BaseForm onSubmit={handleSubmit}>
      <UsernameOrEmailField label="Username or Email" placeholder="Enter your username or email" />
      <PasswordField />

      <BaseButton type="submit" isLoading={isLoading}>
        Sign In
      </BaseButton>

      <Box
        fontSize="sm"
        color="token(colors.blue.600)"
        textAlign="center"
        mt="2"
      >
        <a href="/register" style={{ textDecoration: 'underline', color: 'inherit' }}>
          Don't have an account? Sign up
        </a>
      </Box>
    </BaseForm>
  );
};