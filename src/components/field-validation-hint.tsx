import React from 'react';
import { cn } from '@/lib/utils';

type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
};

type FieldValidationHintProps = {
  value: string;
  maxLength?: number;
  type?: 'text' | 'email' | 'url' | 'password';
  className?: string;
};

const emailRules: ValidationRule[] = [
  {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Valid email format (e.g., user@example.com)',
  },
];

const urlRules: ValidationRule[] = [
  {
    test: (value) => /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value),
    message: 'Valid URL format (e.g., https://example.com)',
  },
];

const passwordRules: ValidationRule[] = [
  {
    test: (value) => value.length >= 8,
    message: 'At least 8 characters',
  },
  {
    test: (value) => /[A-Z]/.test(value),
    message: 'One uppercase letter',
  },
  {
    test: (value) => /[a-z]/.test(value),
    message: 'One lowercase letter',
  },
  {
    test: (value) => /[0-9]/.test(value),
    message: 'One number',
  },
  {
    test: (value) => /[^A-Za-z0-9]/.test(value),
    message: 'One special character',
  },
];

export function FieldValidationHint({
  value,
  maxLength,
  type = 'text',
  className,
}: FieldValidationHintProps) {
  const rules = type === 'email' ? emailRules :
                type === 'url' ? urlRules :
                type === 'password' ? passwordRules : [];

  const getPasswordStrength = (value: string): number => {
    if (!value) return 0;
    return passwordRules.filter(rule => rule.test(value)).length;
  };

  return (
    <div className={cn('text-xs space-y-1', className)}>
      {maxLength && (
        <div className="flex justify-end text-gray-500">
          {value.length}/{maxLength} characters
        </div>
      )}
      
      {rules.length > 0 && (
        <div className="space-y-1">
          {rules.map((rule, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-1',
                rule.test(value) ? 'text-green-600' : 'text-gray-500'
              )}
            >
              <span className="text-xs">
                {rule.test(value) ? '✓' : '○'}
              </span>
              <span>{rule.message}</span>
            </div>
          ))}
        </div>
      )}

      {type === 'password' && value && (
        <div className="space-y-1">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-300',
                getPasswordStrength(value) <= 1 && 'w-1/5 bg-red-500',
                getPasswordStrength(value) === 2 && 'w-2/5 bg-orange-500',
                getPasswordStrength(value) === 3 && 'w-3/5 bg-yellow-500',
                getPasswordStrength(value) === 4 && 'w-4/5 bg-lime-500',
                getPasswordStrength(value) === 5 && 'w-full bg-green-500'
              )}
            />
          </div>
          <p className="text-gray-500">
            Password strength:{' '}
            {getPasswordStrength(value) <= 1 && 'Very Weak'}
            {getPasswordStrength(value) === 2 && 'Weak'}
            {getPasswordStrength(value) === 3 && 'Medium'}
            {getPasswordStrength(value) === 4 && 'Strong'}
            {getPasswordStrength(value) === 5 && 'Very Strong'}
          </p>
        </div>
      )}
    </div>
  );
} 