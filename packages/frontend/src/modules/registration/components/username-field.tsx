import { css } from '@/shared/ui/styled-system/css'
import { Box } from "@chakra-ui/react";

interface UsernameFieldProps {
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

export const UsernameField: React.FC<UsernameFieldProps> = ({
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
        Username
      </Box>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Enter your username"
        required
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
