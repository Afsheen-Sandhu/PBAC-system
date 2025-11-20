"use client";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string; 
}

export function Input({ label, name, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="input input-bordered w-full bg-base-100"
        {...props}
      />
    </div>
  );
}


