import { FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-blue-500"
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
