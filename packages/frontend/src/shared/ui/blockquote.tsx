import { forwardRef } from 'preact/compat';
import { Blockquote as ChakraBlockquote } from "@chakra-ui/react";

export interface BlockquoteProps extends ChakraBlockquote.RootProps {
  cite?: preact.ComponentChild;
  citeUrl?: string;
  icon?: preact.ComponentChild;
  showDash?: boolean;
}

export const Blockquote = forwardRef<HTMLDivElement, BlockquoteProps>(
  function Blockquote(props, ref) {
    const { children, cite, citeUrl, showDash, icon, ...rest } = props;

    return (
      <ChakraBlockquote.Root ref={ref as never} {...rest}>
        {icon}
        <ChakraBlockquote.Content cite={citeUrl}>
          {children}
        </ChakraBlockquote.Content>
        {cite && (
          <ChakraBlockquote.Caption>
            {showDash ? <>&mdash;</> : null} <cite>{cite}</cite>
          </ChakraBlockquote.Caption>
        )}
      </ChakraBlockquote.Root>
    );
  },
);
