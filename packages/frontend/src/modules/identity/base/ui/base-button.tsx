import { css } from '@/shared/ui/styled-system/css';
import { Button as ChakraButton } from "@chakra-ui/react";

interface BaseButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  w?: string;
  h?: string;
  isLoading?: boolean;
  variant?: "solid" | "subtle" | "surface" | "outline" | "ghost" | "plain";
  colorScheme?: string;
}

const baseButtonStyle = css({
  w: "100%",
  h: "12",
  backgroundImage: "linear-gradient(to right, #667eea, #764ba2)",
  color: "white",
  fontWeight: "semibold",
  rounded: "lg",
  _hover: {
    backgroundImage: "linear-gradient(to right, #764ba2, #667eea)",
    transform: "translateY(-2px)",
    shadow: "md",
  },
  _active: { transform: "translateY(0)" }
});

export const BaseButton = ({
  children,
  type = 'button',
  loading = false,
  onClick = () => { /* fallback */ },
  className,
  w,
  h,
  isLoading = false,
  variant,
  colorScheme,
  ...props
}: BaseButtonProps) => {
  const buttonClass = className ?? baseButtonStyle;

  return (
    <ChakraButton
      type={type}
      loading={loading || isLoading}
      w={w}
      h={h}
      className={buttonClass}
      onClick={onClick}
      variant={variant}
      colorScheme={colorScheme}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
