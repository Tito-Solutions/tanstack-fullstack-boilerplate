import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "~/lib/utils";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, label, error, id, required, inputClassName, wrapperClassName, ...props }, ref) => {
    const generatedId = id || React.useId();

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label && (
          <Label htmlFor={generatedId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={generatedId}
          className={cn(
            error && "border-red-500 focus:ring-red-500",
            inputClassName,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${generatedId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${generatedId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
