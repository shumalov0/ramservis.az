'use client';

import { memo, ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  description?: string;
}

const FormField = memo(function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className,
  labelClassName,
  description
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={htmlFor}
        className={cn(
          'text-sm font-medium text-gray-700 dark:text-gray-300',
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
          labelClassName
        )}
      >
        {label}
      </Label>
      
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default FormField;