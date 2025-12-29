import { css } from '@/shared/ui/styled-system/css'
import { Box } from "@chakra-ui/react";

interface PasswordFieldProps {
  error?: string;
  isInvalid?: boolean;
}

const inputStyle = css({
  width: "100%",
  height: "3rem", // h="12" = 3rem
  px: "4",
  border: "2px solid",
  borderColor: "gray.200",
  rounded: "lg",
  _focus: {
    outline: "none",
    borderColor: "blue.500",
    boxShadow: "0 0 0 3px token(colors.blue.100)"
  },
  transitionProperty: "all",
  transitionDuration: "normal",
  "&[data-invalid='true']": {
    borderColor: "red.500"
  }
});

export const PasswordField: React.FC<PasswordFieldProps> = ({
  error,
  isInvalid = false
}) => {
  return (
    <Box w="full">
      <Box
        fontSize="sm"
        fontWeight="medium"
        color="gray.700"
        mb="2"
      >
        Password
      </Box>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Create a password"
        required
        minLength={6}
        className={inputStyle}
        data-invalid={isInvalid}
      />
      {error && (
        <Box color="token(colors.red.500)" fontSize="xs" mt="1">
          {error}
        </Box>
      )}
    </Box>
  );
};
