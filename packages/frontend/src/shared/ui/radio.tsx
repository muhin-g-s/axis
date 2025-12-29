import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react"
import { forwardRef } from "preact/compat";
import { type JSX } from "preact/jsx-runtime";

export interface RadioProps extends ChakraRadioGroup.ItemProps {
	rootRef?: preact.Ref<HTMLDivElement | null>;
  inputProps?: JSX.IntrinsicElements['input']
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, ...rest } = props
    return (
      <ChakraRadioGroup.Item ref={rootRef as never} {...rest}>
        <ChakraRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        <ChakraRadioGroup.ItemIndicator />
        {children && (
          <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
        )}
      </ChakraRadioGroup.Item>
    )
  },
)

export const RadioGroup = ChakraRadioGroup.Root
