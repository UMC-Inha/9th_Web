interface CheckProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox({ label, ...props }: CheckProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
