import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PolicyFormData } from '@/components/PrivacyPolicyForm';

type FormSummaryProps = {
  data: PolicyFormData;
  onEdit: (section: string) => void;
  className?: string;
};

type SummaryField = {
  label: string;
  value: string | boolean;
  key: keyof PolicyFormData;
};

type SummarySection = {
  title: string;
  id: string;
  fields: SummaryField[];
};

export function FormSummary({ data, onEdit, className }: FormSummaryProps) {
  const sections: SummarySection[] = [
    {
      title: 'General Information',
      id: 'general',
      fields: [
        { label: 'Business Name', value: data.businessName, key: 'businessName' as const },
        { label: 'Website URL', value: data.websiteUrl, key: 'websiteUrl' as const },
        { label: 'Contact Email', value: data.contactEmail, key: 'contactEmail' as const },
      ],
    },
    {
      title: 'Data Collection',
      id: 'data',
      fields: [
        { label: 'Collects Personal Info', value: data.collectsPersonalInfo, key: 'collectsPersonalInfo' as const },
        ...(data.collectsPersonalInfo ? [
          { label: 'Collects Name', value: data.collectsName, key: 'collectsName' as const },
          { label: 'Collects Email', value: data.collectsEmail, key: 'collectsEmail' as const },
          { label: 'Collects Phone', value: data.collectsPhone, key: 'collectsPhone' as const },
          { label: 'Collects Payment Info', value: data.collectsPayment, key: 'collectsPayment' as const },
          { label: 'Collects Location', value: data.collectsLocation, key: 'collectsLocation' as const },
          { label: 'Collects IP', value: data.collectsIp, key: 'collectsIp' as const },
        ] : []),
      ],
    },
    {
      title: 'Data Sharing',
      id: 'sharing',
      fields: [
        { label: 'Shares with Third Parties', value: data.sharesWithThirdParties, key: 'sharesWithThirdParties' as const },
        ...(data.sharesWithThirdParties ? [
          { label: 'Shares with Analytics', value: data.sharesWithAnalytics, key: 'sharesWithAnalytics' as const },
          { label: 'Shares with Advertising', value: data.sharesWithAdvertising, key: 'sharesWithAdvertising' as const },
          { label: 'Shares with Payment Processors', value: data.sharesWithPayment, key: 'sharesWithPayment' as const },
          { label: 'Shares with Social Media', value: data.sharesWithSocial, key: 'sharesWithSocial' as const },
        ] : []),
      ],
    },
    {
      title: 'Legal Compliance',
      id: 'legal',
      fields: [
        { label: 'GDPR Compliance', value: data.compliesWithGDPR, key: 'compliesWithGDPR' as const },
        { label: 'CCPA Compliance', value: data.compliesWithCCPA, key: 'compliesWithCCPA' as const },
      ],
    },
  ];

  return (
    <div className={cn('space-y-8', className)}>
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{section.title}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(section.id)}
              className="text-sm"
            >
              Edit
            </Button>
          </div>
          <div className="grid gap-3">
            {section.fields.map((field) => (
              <div key={String(field.key)} className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium text-gray-500">
                  {field.label}
                </div>
                <div className="text-sm">
                  {typeof field.value === 'boolean' ? (
                    <span className={field.value ? 'text-green-600' : 'text-gray-500'}>
                      {field.value ? 'Yes' : 'No'}
                    </span>
                  ) : (
                    field.value || <span className="text-gray-400">Not provided</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 