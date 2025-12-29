import { forwardRef, type JSX } from 'preact/compat';
import { Switch as ChakraSwitch } from "@chakra-ui/react";

export interface SwitchProps extends ChakraSwitch.RootProps {
	rootRef?: preact.Ref<HTMLLabelElement | null>;
  inputProps?: JSX.IntrinsicElements['input']
  trackLabel?: { on: preact.ComponentChild; off: preact.ComponentChild };
  thumbLabel?: { on: preact.ComponentChild; off: preact.ComponentChild };
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const { inputProps, children, rootRef, trackLabel, thumbLabel, ...rest } = props;

    return (
      <ChakraSwitch.Root ref={rootRef as never} {...rest}>
        <ChakraSwitch.HiddenInput ref={ref as never} {...inputProps} />
        <ChakraSwitch.Control>
          <ChakraSwitch.Thumb>
            {thumbLabel && (
              <ChakraSwitch.ThumbIndicator fallback={thumbLabel.off}>
                {thumbLabel.on}
              </ChakraSwitch.ThumbIndicator>
            )}
          </ChakraSwitch.Thumb>
          {trackLabel && (
            <ChakraSwitch.Indicator fallback={trackLabel.off}>
              {trackLabel.on}
            </ChakraSwitch.Indicator>
          )}
        </ChakraSwitch.Control>
        {children != null && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
      </ChakraSwitch.Root>
    );
  }
);
