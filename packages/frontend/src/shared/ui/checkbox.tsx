import { forwardRef } from 'preact/compat';
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import { type JSX, type ComponentChild } from 'preact';

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: ComponentChild;
  inputProps?: JSX.IntrinsicElements['input'];
  rootRef?: preact.Ref<HTMLLabelElement | null>;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { icon, children, inputProps, rootRef, ...rest } = props;

    return (
      <ChakraCheckbox.Root ref={rootRef as never} {...rest}>
        <ChakraCheckbox.HiddenInput ref={ref as never} {...inputProps} />
        <ChakraCheckbox.Control>
          {icon ?? <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>
        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  }
);
