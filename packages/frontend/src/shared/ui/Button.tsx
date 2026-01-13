import { type ComponentChildren } from "preact";

interface ButtonProps {
  children: ComponentChildren;
  onClick?: () => void;
  disabled?: boolean;
	type?: 'button' | 'submit'
}

export function Button({ children, onClick, disabled, type }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}
