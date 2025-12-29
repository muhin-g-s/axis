import { css } from '@/shared/ui/styled-system/css';
import { EmailField, PasswordField, UsernameField } from "./components";
import { Box, Button } from "@chakra-ui/react";

const stackStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6",
  width: "100%",
});

const innerStackStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4",
});

interface RegistrationFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const RegistrationForm = ({
  onSubmit = () => { /* fallback */ },
  isLoading = false
}: RegistrationFormProps) => {
  const handleSubmit = (_: Event) => {
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className={stackStyle}>
        <div className={innerStackStyle}>
          <UsernameField />
          <EmailField />
          <PasswordField />
        </div>

        <Button
          type="submit"
          loading={isLoading}
          w="100%"
          h="12"
          backgroundImage="linear-gradient(to right, #667eea, #764ba2)"
          color="white"
          fontWeight="semibold"
          rounded="lg"
          _hover={{
            backgroundImage: "linear-gradient(to right, #764ba2, #667eea)",
            transform: "translateY(-2px)",
            shadow: "md",
          }}
          _active={{ transform: "translateY(0)" }}
        >
          Create Account
        </Button>

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
      </div>
    </form>
  );
};
