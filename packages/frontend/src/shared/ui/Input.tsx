interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
	onBlur?: () => void
  error?: string;
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
}: InputProps) {
  return (
    <div>
      <label>
        {label}
        <input
          type={type}
          value={value}
          onChange={(e) => { onChange((e.target as HTMLInputElement).value); }}
					style={{ border: '1px solid black' }}
        />
      </label>
      {error && <div>{error}</div>}
    </div>
  );
}
