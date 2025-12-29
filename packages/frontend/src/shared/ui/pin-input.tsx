import { forwardRef, type JSX } from 'preact/compat';
import { PinInput as ChakraPinInput, Group } from "@chakra-ui/react";

export interface PinInputProps extends ChakraPinInput.RootProps {
  rootRef?: preact.Ref<HTMLLabelElement | null>;
  count?: number;
  inputProps?: JSX.IntrinsicElements['input']
  attached?: boolean;
}

export const PinInput = forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(props, ref) {
    const { count = 4, inputProps, rootRef, attached, ...rest } = props;

    return (
      <ChakraPinInput.Root ref={rootRef as never} {...rest}>
        <ChakraPinInput.HiddenInput ref={ref as never} {...inputProps} />
        <ChakraPinInput.Control>
          <Group attached={attached}>
            {Array.from({ length: count }).map((_, index) => (
              <ChakraPinInput.Input key={index} index={index} />
            ))}
          </Group>
        </ChakraPinInput.Control>
      </ChakraPinInput.Root>
    );
  }
);
