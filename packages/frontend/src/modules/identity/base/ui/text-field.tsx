import { css } from '@/shared/ui/styled-system/css'
import { Box } from "@chakra-ui/react";

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
  isInvalid?: boolean;
  required?: boolean;
  minLength?: number;
  className?: string;
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

export const TextField = ({
  id,
  name,
  label,
  placeholder,
  type = "text",
  error,
  isInvalid = false,
  required = false,
  minLength,
  className
}: TextFieldProps) => {
  return (
    <Box w="full" className={className}>
      <Box
        fontSize="sm"
        fontWeight="medium"
        color="gray.700"
        mb="2"
      >
        {label}
      </Box>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
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
