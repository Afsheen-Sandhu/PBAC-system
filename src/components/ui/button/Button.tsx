interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles = "rounded-md font-medium transition-colors";

  const variants = {
    primary: "bg-yellow-500 text-white hover:bg-yellow-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
