export default function Button({
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      {...props}
      className={`w-full py-2 rounded-md text-white font-medium transition ${
        disabled
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {children}
    </button>
  );
}
