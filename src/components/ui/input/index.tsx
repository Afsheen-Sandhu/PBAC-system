"use client";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, name, className = "", ...props }: InputProps) {
  const inputField = (
    <input
      id={name}
      name={name}
      className={`w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      {...props}
    />
  );

  return (
    <div className="space-y-1">
      {label ? (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      {inputField}
    </div>
  );
}


