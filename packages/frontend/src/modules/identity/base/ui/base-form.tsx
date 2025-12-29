import { css } from '@/shared/ui/styled-system/css';
import { type CSSProperties, type ComponentChildren } from 'preact';

interface BaseFormProps {
  children: ComponentChildren;
  onSubmit?: (event: SubmitEvent) => void;
  className?: string;
  style?: CSSProperties;
}

const stackStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6",
  width: "100%",
});

const innerStackStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4",
});

export const BaseForm = ({
  children,
  onSubmit = (event: SubmitEvent) => { event.preventDefault(); },
  className,
  style = {},
}: BaseFormProps) => {
  const formClass = className ?? stackStyle;

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    <form onSubmit={onSubmit} style={{ width: '100%', ...style }}>
      <div className={formClass}>
        <div className={innerStackStyle}>
          {children}
        </div>
      </div>
    </form>
  );
};
