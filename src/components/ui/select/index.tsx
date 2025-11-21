import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  id: string;
  name: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  defaultOptionText?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, defaultOptionText = "Select an option", value, onChange, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full rounded-md border bg-background px-2 py-1 text-sm",
          className
        )}
        value={value}
        onChange={onChange}
        ref={ref}
        {...props}
      >
        <option value="">{defaultOptionText}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
