import React from 'react';
import { cn } from '@/lib/utils';

type ValidationStatus = {
  field: string;
  isValid: boolean;
  message?: string;
};

type FormValidationStatusProps = {
  validations: ValidationStatus[];
  className?: string;
};

export function FormValidationStatus({ validations, className }: FormValidationStatusProps) {
  const validCount = validations.filter(v => v.isValid).length;
  const totalCount = validations.length;
  const percentage = Math.round((validCount / totalCount) * 100);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Form Validation
        </h3>
        <span className="text-sm text-gray-500">
          {validCount}/{totalCount} fields valid
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {validations.map((validation) => (
          <div
            key={validation.field}
            className={cn(
              'flex items-start gap-2 text-sm',
              validation.isValid ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <span className="mt-0.5">
              {validation.isValid ? '✓' : '○'}
            </span>
            <div>
              <p>{validation.field}</p>
              {!validation.isValid && validation.message && (
                <p className="text-xs text-red-500 mt-0.5">{validation.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 