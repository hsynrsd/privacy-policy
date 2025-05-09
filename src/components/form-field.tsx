import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  className?: string;
  field: any; // This will be the field from react-hook-form
};

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  tooltip,
  error,
  className,
  field,
}: FormFieldProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-center gap-2">
        <Label 
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
          )}
        >
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full w-4 h-4 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
        {...field}
      />
      {error && (
        <p className="text-sm text-red-500" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
} 