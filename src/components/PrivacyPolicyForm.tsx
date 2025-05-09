"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { FormField } from '@/components/form-field';
import { FormCompletionStatus } from '@/components/form-completion-status';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FormValidationStatus } from '@/components/form-validation-status';
import { useAutosave, getSavedData } from '@/hooks/useAutosave';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { FieldValidationHint } from '@/components/field-validation-hint';
import { FormSummary } from '@/components/form-summary';
import { format } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { GeneratedPolicy } from "@/services/PrivacyPolicyGenerator";

export type PolicyFormData = {
  // General Information
  businessName: string;
  websiteUrl: string;
  contactEmail: string;

  // Data Collection
  collectsPersonalInfo: boolean;
  collectsName: boolean;
  collectsEmail: boolean;
  collectsPhone: boolean;
  collectsPayment: boolean;
  collectsLocation: boolean;
  collectsIp: boolean;
  collectsCookies: boolean;
  collectsOther: boolean;
  collectsOtherSpecify: string;

  // Data Usage
  usesForServices: boolean;
  usesForMarketing: boolean;
  usesForCommunication: boolean;
  usesForLegal: boolean;
  usesForAnalytics: boolean;
  usesForOther: boolean;
  usesForOtherSpecify: string;

  // Third-Party Sharing
  sharesWithThirdParties: boolean;
  sharesWithAnalytics: boolean;
  sharesWithAdvertising: boolean;
  sharesWithPayment: boolean;
  sharesWithSocial: boolean;
  sharesWithOther: boolean;
  sharesWithOtherSpecify: string;
  thirdPartiesUseForOwnPurposes: boolean;
  thirdPartyPurposesSpecify: string;

  // Data Storage and Security
  dataStorageLocation: string;
  securityMeasures: string;
  storesDataIndefinitely: boolean;
  dataRetentionPeriod: string;

  // Cookies and Tracking
  usesCookies: boolean;
  usesEssentialCookies: boolean;
  usesAnalyticsCookies: boolean;
  usesAdvertisingCookies: boolean;
  usesSocialCookies: boolean;
  usesOtherCookies: boolean;
  otherCookiesSpecify: string;

  // User Rights
  providesUserRights: boolean;
  userRightsProcess: string;
  providesOptOut: boolean;
  optOutProcess: string;

  // Legal Compliance
  compliesWithGDPR: boolean;
  compliesWithCCPA: boolean;
  compliesWithOther: boolean;
  compliesWithOtherSpecify: string;

  // Policy Changes
  notificationMethod: string;
  effectiveDate: string;

  // Data Usage Section
  dataUsagePurposes: {
    userCommunication: boolean;
    paymentProcessing: boolean;
    analytics: boolean;
    serviceImprovement: boolean;
    marketing: boolean;
    other: boolean;
  };
  dataUsageOtherSpecify: string;

  // Cookie Usage
  cookieTypes: {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    advertising: boolean;
    other: boolean;
  };
  cookieOtherSpecify: string;

  // Age Restrictions
  minimumAge: "13" | "16" | "18" | "none";
  parentalConsentRequired: boolean;

  // Data Retention
  dataRetentionPeriods: {
    accountData: string;
    transactionData: string;
    communicationHistory: string;
    analyticsData: string;
  };
  dataRetentionJustification: string;

  // Policy Updates
  policyUpdateNotification: {
    email: boolean;
    siteNotice: boolean;
    popup: boolean;
    other: boolean;
  };
  policyUpdateNotificationOther: string;
  gracePeriod: string;

  // Legal Disclaimer
  acknowledgeNotLegalAdvice: boolean;
};

const defaultValues: PolicyFormData = {
  businessName: "",
  websiteUrl: "",
  contactEmail: "",
  collectsPersonalInfo: false,
  collectsName: false,
  collectsEmail: false,
  collectsPhone: false,
  collectsPayment: false,
  collectsLocation: false,
  collectsIp: false,
  collectsCookies: false,
  collectsOther: false,
  collectsOtherSpecify: "",
  usesForServices: false,
  usesForMarketing: false,
  usesForCommunication: false,
  usesForLegal: false,
  usesForAnalytics: false,
  usesForOther: false,
  usesForOtherSpecify: "",
  sharesWithThirdParties: false,
  sharesWithAnalytics: false,
  sharesWithAdvertising: false,
  sharesWithPayment: false,
  sharesWithSocial: false,
  sharesWithOther: false,
  sharesWithOtherSpecify: "",
  thirdPartiesUseForOwnPurposes: false,
  thirdPartyPurposesSpecify: "",
  dataStorageLocation: "",
  securityMeasures: "",
  storesDataIndefinitely: false,
  dataRetentionPeriod: "",
  usesCookies: false,
  usesEssentialCookies: false,
  usesAnalyticsCookies: false,
  usesAdvertisingCookies: false,
  usesSocialCookies: false,
  usesOtherCookies: false,
  otherCookiesSpecify: "",
  providesUserRights: false,
  userRightsProcess: "",
  providesOptOut: false,
  optOutProcess: "",
  compliesWithGDPR: false,
  compliesWithCCPA: false,
  compliesWithOther: false,
  compliesWithOtherSpecify: "",
  notificationMethod: "",
  effectiveDate: "",
  dataUsagePurposes: {
    userCommunication: false,
    paymentProcessing: false,
    analytics: false,
    serviceImprovement: false,
    marketing: false,
    other: false,
  },
  dataUsageOtherSpecify: "",
  cookieTypes: {
    essential: false,
    functional: false,
    analytics: false,
    advertising: false,
    other: false,
  },
  cookieOtherSpecify: "",
  minimumAge: "none",
  parentalConsentRequired: false,
  dataRetentionPeriods: {
    accountData: "",
    transactionData: "",
    communicationHistory: "",
    analyticsData: "",
  },
  dataRetentionJustification: "",
  policyUpdateNotification: {
    email: false,
    siteNotice: false,
    popup: false,
    other: false,
  },
  policyUpdateNotificationOther: "",
  gracePeriod: "30 days",
  acknowledgeNotLegalAdvice: false,
};

// Type definitions at the top of the file
type Section = {
  name: string;
  id: string;
  description: string;
};

type SectionStatus = Section & {
  completed: boolean;
  current: boolean;
};

type SectionComponentProps = {
  control: Control<PolicyFormData>;
  watch: any;
  isActive: boolean;
  isCompleted: boolean;
  description?: string;
  setActiveTab: (tab: string) => void;
};

// Component definitions
const FormSection = ({ 
  title, 
  children, 
  isActive = false,
  isCompleted = false,
  description,
}: {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  description?: string;
}) => {
  return (
    <AccordionItem value={title} className="mb-4 rounded-lg border bg-card">
      <AccordionTrigger className="px-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};

// Update the ProgressIndicator component
const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div 
      className="mb-8" 
      role="progressbar" 
      aria-valuemin={1} 
      aria-valuemax={totalSteps} 
      aria-valuenow={currentStep}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      <div className="flex justify-between mb-3">
        <span className="text-base font-medium">Progress</span>
        <span className="text-base text-gray-600">{currentStep}/{totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

type CheckboxFieldProps = {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  control?: Control<any>;
  name?: string;
};

const CheckboxField = ({
  id,
  label,
  checked,
  onCheckedChange,
  control,
  name,
}: CheckboxFieldProps) => {
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        )}
      />
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};

type PrivacyPolicyFormProps = {
  onSubmit: (data: PolicyFormData) => void;
  message?: Message;
};

const KeyboardHelp = () => (
  <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
    <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">←</kbd> and <kbd className="px-1 py-0.5 bg-gray-100 rounded">→</kbd> to move between tabs</li>
      <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">Home</kbd> to go to the first tab</li>
      <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">End</kbd> to go to the last tab</li>
      <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">Tab</kbd> to navigate form fields</li>
    </ul>
  </div>
);

const getFieldValidationStatus = (
  name: keyof PolicyFormData,
  dirtyFields: Record<string, any>,
  errors: Record<string, any>
): boolean => {
  // Handle nested fields
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    return Boolean(
      dirtyFields[parent]?.[child] && 
      !errors[parent]?.[child]
    );
  }
  
  // Handle regular fields
  if (typeof dirtyFields[name] === 'object') {
    // For object fields, check if any child is dirty and valid
    return Object.entries(dirtyFields[name] || {}).some(
      ([key]) => dirtyFields[name][key] && !errors[name]?.[key]
    );
  }
  
  // For simple fields
  return Boolean(dirtyFields[name] && !errors[name]);
};

// Rename FormField to CustomFormField to avoid naming conflict
const CustomFormField = ({ label, children, helpText }: { label: string; children: React.ReactNode; helpText?: string }) => (
  <div className="space-y-2 fade-in">
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {helpText && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <InfoIcon className="h-4 w-4 text-gray-500 cursor-help hover-lift" />
          </HoverCardTrigger>
          <HoverCardContent className="text-sm bounce-in">
            {helpText}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
    <div className="slide-in">
      {children}
    </div>
  </div>
);

// Update isStepComplete function to include new sections
const isStepComplete = (step: string, formData: PolicyFormData): boolean => {
  switch (step) {
    case 'general':
      return Boolean(formData.businessName && formData.websiteUrl && formData.contactEmail);
    case 'data':
      return formData.collectsPersonalInfo !== undefined;
    case 'sharing':
      return formData.sharesWithThirdParties !== undefined;
    case 'legal':
      return formData.compliesWithGDPR !== undefined && formData.compliesWithCCPA !== undefined;
    case 'dataUsage':
      if (!formData.collectsPersonalInfo) return true;
      return Object.values(formData.dataUsagePurposes).some(Boolean);
    case 'cookies':
      return formData.usesCookies !== undefined && 
        (!formData.usesCookies || Object.values(formData.cookieTypes).some(Boolean));
    case 'retention':
      return Object.values(formData.dataRetentionPeriods).some(Boolean);
    case 'updates':
      return Object.values(formData.policyUpdateNotification).some(Boolean) && Boolean(formData.gracePeriod);
    case 'review':
      return true;
    default:
      return false;
  }
};

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 rounded-full p-2 transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
};

// Add a legal disclaimer component
const LegalDisclaimer = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
    <h4 className="text-yellow-800 font-medium mb-2">Important Disclaimer!</h4>
    <p className="text-sm text-yellow-700">
      This privacy policy generator is provided as a free tool to help website owners create a basic privacy policy. 
      While we strive to include common privacy policy elements and stay up-to-date with privacy regulations, 
      this is not legal advice. The generated policy may need additional modifications to fully comply with your 
      specific legal requirements and jurisdiction. We strongly recommend having your privacy policy reviewed by 
      a qualified legal professional.
    </p>
  </div>
);

// Create a type for nested form data
type NestedFormData = {
  [K in keyof PolicyFormData]: PolicyFormData[K] extends object
    ? { [P in keyof PolicyFormData[K]]: boolean | string }
    : PolicyFormData[K];
};

// Update the form sections to use proper typing
const DataUsageSection = ({ control, watch }: { control: Control<PolicyFormData>; watch: any }) => {
  const collectsPersonalInfo = watch('collectsPersonalInfo');
  const collectsName = watch('collectsName');
  const collectsEmail = watch('collectsEmail');
  const collectsPhone = watch('collectsPhone');
  const collectsPayment = watch('collectsPayment');
  const collectsLocation = watch('collectsLocation');
  const collectsAnalytics = watch('collectsIp') || watch('collectsCookies');

  if (!collectsPersonalInfo) {
    return (
      <FormSection
        title="Data Usage"
        description="No data usage to specify as no personal information is collected"
      >
        <p className="text-sm text-gray-500">
          This section is not applicable as you have indicated that you do not collect personal information.
        </p>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Data Usage"
      description="Specify how you use collected data"
    >
      <div className="space-y-4">
        <h4 className="text-sm font-medium">How do you use the collected data?</h4>
        <div className="space-y-2">
          {collectsEmail && (
            <Controller
              control={control}
              name="dataUsagePurposes.userCommunication"
              render={({ field }) => (
                <CheckboxField
                  id="userCommunication"
                  label="User Communication (emails, notifications, support)"
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          )}
          
          {collectsPayment && (
            <Controller
              control={control}
              name="dataUsagePurposes.paymentProcessing"
              render={({ field }) => (
                <CheckboxField
                  id="paymentProcessing"
                  label="Payment Processing (transactions, billing, subscriptions)"
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          )}

          {collectsAnalytics && (
            <Controller
              control={control}
              name="dataUsagePurposes.analytics"
              render={({ field }) => (
                <CheckboxField
                  id="analytics"
                  label="Analytics and Usage Tracking (improve our services)"
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="dataUsagePurposes.serviceImprovement"
            render={({ field }) => (
              <CheckboxField
                id="serviceImprovement"
                label="Service Improvement (enhance features and functionality)"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            )}
          />

          {(collectsEmail || collectsPhone) && (
            <Controller
              control={control}
              name="dataUsagePurposes.marketing"
              render={({ field }) => (
                <CheckboxField
                  id="marketing"
                  label="Marketing and Promotional Communications"
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="dataUsagePurposes.other"
            render={({ field }) => (
              <CheckboxField
                id="dataUsageOther"
                label="Other Purposes"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            )}
          />

          {watch("dataUsagePurposes.other") && (
            <div className="ml-6 mt-2">
              <Controller
                control={control}
                name="dataUsageOtherSpecify"
                rules={{
                  required: watch("dataUsagePurposes.other")
                    ? "Please specify other data usage purposes"
                    : false,
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dataUsageOtherSpecify">
                      Please specify other purposes:
                    </Label>
                    <Input
                      id="dataUsageOtherSpecify"
                      placeholder="Describe other ways you use the data"
                      {...field}
                    />
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {Object.values(watch("dataUsagePurposes") || {}).every(v => !v) && (
          <p className="text-yellow-600 bg-yellow-50 p-4 rounded-lg mt-4">
            ⚠️ You have indicated that you collect personal information but haven't specified how it will be used. 
            Please select at least one data usage purpose to ensure transparency in your privacy policy.
          </p>
        )}
      </div>
    </FormSection>
  );
};

// Update other sections similarly with proper typing
const CookieSection = ({ control, watch }: { control: Control<PolicyFormData>; watch: any }) => (
  <FormSection
    title="Cookie Usage"
    description="Specify your cookie policy"
  >
    <div className="space-y-4">
      <Controller
        control={control}
        name="usesCookies"
        render={({ field }) => (
          <CheckboxField
            id="usesCookies"
            label="Does your website use cookies?"
            checked={field.value as boolean}
            onCheckedChange={field.onChange}
          />
        )}
      />
      
      {watch("usesCookies") && (
        <div className="ml-6 space-y-2">
          <h4 className="text-sm font-medium">Cookie Types Used:</h4>
          <Controller
            control={control}
            name="cookieTypes.essential"
            render={({ field }) => (
              <CheckboxField
                id="essentialCookies"
                label="Essential Cookies (required for basic functionality)"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="cookieTypes.functional"
            render={({ field }) => (
              <CheckboxField
                id="functionalCookies"
                label="Functional Cookies (remember user preferences)"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="cookieTypes.analytics"
            render={({ field }) => (
              <CheckboxField
                id="analyticsCookies"
                label="Analytics Cookies (track usage patterns)"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="cookieTypes.advertising"
            render={({ field }) => (
              <CheckboxField
                id="advertisingCookies"
                label="Advertising Cookies (personalized ads)"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      )}
    </div>
  </FormSection>
);

// Add Data Retention Section
const DataRetentionSection = ({ control }: { control: Control<PolicyFormData> }) => (
  <FormSection
    title="Data Retention"
    description="Specify how long you keep different types of data"
  >
    <div className="space-y-4">
      <div className="grid gap-4">
        <CustomFormField
          label="Account Data Retention"
          helpText="How long do you keep user account data?"
        >
          <Controller
            control={control}
            name="dataRetentionPeriods.accountData"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g., Until account deletion"
                value={field.value as string}
                onChange={field.onChange}
              />
            )}
          />
        </CustomFormField>

        <CustomFormField
          label="Transaction Data Retention"
          helpText="How long do you keep payment/transaction records?"
        >
          <Controller
            control={control}
            name="dataRetentionPeriods.transactionData"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g., 7 years for tax purposes"
                value={field.value as string}
                onChange={field.onChange}
              />
            )}
          />
        </CustomFormField>

        <CustomFormField
          label="Communication History"
          helpText="How long do you keep communication records?"
        >
          <Controller
            control={control}
            name="dataRetentionPeriods.communicationHistory"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g., 2 years after last contact"
                value={field.value as string}
                onChange={field.onChange}
              />
            )}
          />
        </CustomFormField>

        <CustomFormField
          label="Analytics Data"
          helpText="How long do you keep usage/analytics data?"
        >
          <Controller
            control={control}
            name="dataRetentionPeriods.analyticsData"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g., 26 months"
                value={field.value as string}
                onChange={field.onChange}
              />
            )}
          />
        </CustomFormField>
      </div>
    </div>
  </FormSection>
);

// Add Policy Updates Section
const PolicyUpdatesSection = ({ control }: { control: Control<PolicyFormData> }) => (
  <FormSection
    title="Policy Updates"
    description="How will users be notified of changes?"
  >
    <div className="space-y-4">
      <div className="space-y-2">
        <Controller
          control={control}
          name="policyUpdateNotification.email"
          render={({ field }) => (
            <CheckboxField
              id="emailNotification"
              label="Email Notification"
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="policyUpdateNotification.siteNotice"
          render={({ field }) => (
            <CheckboxField
              id="siteNotice"
              label="Website Notice"
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="policyUpdateNotification.popup"
          render={({ field }) => (
            <CheckboxField
              id="popup"
              label="Pop-up Notification"
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <CustomFormField
        label="Grace Period"
        helpText="How long before changes take effect?"
      >
        <Controller
          control={control}
          name="gracePeriod"
          render={({ field }) => (
            <Input
              placeholder="e.g., 30 days"
              {...field}
            />
          )}
        />
      </CustomFormField>
    </div>
  </FormSection>
);

// Add type for form state
type FormState = {
  dirtyFields: {
    [K in keyof PolicyFormData]: PolicyFormData[K] extends object
      ? { [P in keyof PolicyFormData[K]]?: boolean }
      : boolean;
  };
};

// Update SectionProps to match SectionComponentProps
type SectionProps = SectionComponentProps;

// Add section components
const GeneralSection = ({ control, isActive, isCompleted, description }: SectionProps) => (
  <FormSection
    title="General Information"
    isActive={isActive}
    isCompleted={isCompleted}
    description={description}
  >
    <div className="grid gap-4">
      <CustomFormField 
        label="Business Name" 
        helpText="The legal name of your business or organization that owns the website/app"
      >
        <Controller
          control={control}
          name="businessName"
          rules={{ required: "Business name is required" }}
          render={({ field }) => (
            <>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                {...field}
              />
              <FieldValidationHint
                value={field.value}
                maxLength={100}
                className="mt-1"
              />
            </>
          )}
        />
      </CustomFormField>

      <CustomFormField 
        label="Website URL"
        helpText="The full URL where this privacy policy will be displayed"
      >
        <Controller
          control={control}
          name="websiteUrl"
          rules={{ 
            required: "Website URL is required",
            pattern: {
              value: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
              message: "Please enter a valid URL"
            }
          }}
          render={({ field }) => (
            <>
              <Input
                id="websiteUrl"
                placeholder="https://example.com"
                {...field}
              />
              <FieldValidationHint
                value={field.value}
                type="url"
                className="mt-1"
              />
            </>
          )}
        />
      </CustomFormField>

      <CustomFormField 
        label="Contact Email"
        helpText="The email address where users can send privacy-related inquiries"
      >
        <Controller
          control={control}
          name="contactEmail"
          rules={{
            required: "Contact email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <>
              <Input
                id="contactEmail"
                type="email"
                placeholder="privacy@example.com"
                {...field}
              />
              <FieldValidationHint
                value={field.value}
                type="email"
                className="mt-1"
              />
            </>
          )}
        />
      </CustomFormField>
    </div>
  </FormSection>
);

const DataCollectionSection = ({ control, watch, isActive, isCompleted, description }: SectionProps) => {
  const collectsPersonalInfo = watch('collectsPersonalInfo');
  const collectsOther = watch('collectsOther');

  return (
    <FormSection
      title="Data Collection"
      isActive={isActive}
      isCompleted={isCompleted}
      description={description}
    >
      <div className="space-y-4">
        <CheckboxField
          id="collectsPersonalInfo"
          label="Do you collect personal information from users?"
          control={control}
          name="collectsPersonalInfo"
        />

        {collectsPersonalInfo && (
          <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
            <p className="text-sm font-medium">
              Select the types of data you collect:
            </p>
            <CheckboxField
              id="collectsName"
              label="Name"
              control={control}
              name="collectsName"
            />
            <CheckboxField
              id="collectsEmail"
              label="Email Address"
              control={control}
              name="collectsEmail"
            />
            <CheckboxField
              id="collectsPhone"
              label="Phone Number"
              control={control}
              name="collectsPhone"
            />
            <CheckboxField
              id="collectsPayment"
              label="Payment Information (Credit Card, Billing Info)"
              control={control}
              name="collectsPayment"
            />
            <CheckboxField
              id="collectsLocation"
              label="Location Data"
              control={control}
              name="collectsLocation"
            />
            <CheckboxField
              id="collectsIp"
              label="IP Address"
              control={control}
              name="collectsIp"
            />
            <CheckboxField
              id="collectsCookies"
              label="Cookies and Tracking Technologies"
              control={control}
              name="collectsCookies"
            />
            <CheckboxField
              id="collectsOther"
              label="Other"
              control={control}
              name="collectsOther"
            />

            {collectsOther && (
              <div className="ml-6 mt-2">
                <Label htmlFor="collectsOtherSpecify">
                  Please specify:
                </Label>
                <Controller
                  control={control}
                  name="collectsOtherSpecify"
                  rules={{
                    required: collectsOther
                      ? "Please specify other data types"
                      : false,
                  }}
                  render={({ field }) => (
                    <Input
                      id="collectsOtherSpecify"
                      className="mt-1"
                      placeholder="Other data types collected"
                      {...field}
                    />
                  )}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </FormSection>
  );
};

const DataSharingSection = ({ control, watch, isActive, isCompleted, description }: SectionProps) => {
  const sharesWithThirdParties = watch('sharesWithThirdParties');
  const sharesWithOther = watch('sharesWithOther');
  const thirdPartiesUseForOwnPurposes = watch('thirdPartiesUseForOwnPurposes');

  return (
    <FormSection
      title="Data Sharing"
      isActive={isActive}
      isCompleted={isCompleted}
      description={description}
    >
      <div className="space-y-4">
        <CheckboxField
          id="sharesWithThirdParties"
          label="Do you share user data with third parties?"
          control={control}
          name="sharesWithThirdParties"
        />

        {sharesWithThirdParties && (
          <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
            <p className="text-sm font-medium">
              Select the types of third parties:
            </p>
            <CheckboxField
              id="sharesWithAnalytics"
              label="Analytics Providers"
              control={control}
              name="sharesWithAnalytics"
            />
            <CheckboxField
              id="sharesWithAdvertising"
              label="Advertising Networks"
              control={control}
              name="sharesWithAdvertising"
            />
            <CheckboxField
              id="sharesWithPayment"
              label="Payment Processors"
              control={control}
              name="sharesWithPayment"
            />
            <CheckboxField
              id="sharesWithSocial"
              label="Social Media Platforms"
              control={control}
              name="sharesWithSocial"
            />
            <CheckboxField
              id="sharesWithOther"
              label="Other"
              control={control}
              name="sharesWithOther"
            />

            {sharesWithOther && (
              <div className="ml-6 mt-2">
                <Label htmlFor="sharesWithOtherSpecify">
                  Please specify:
                </Label>
                <Controller
                  control={control}
                  name="sharesWithOtherSpecify"
                  rules={{
                    required: sharesWithOther
                      ? "Please specify other third parties"
                      : false,
                  }}
                  render={({ field }) => (
                    <Input
                      id="sharesWithOtherSpecify"
                      className="mt-1"
                      placeholder="Other third parties"
                      {...field}
                    />
                  )}
                />
              </div>
            )}

            <div className="mt-4">
              <CheckboxField
                id="thirdPartiesUseForOwnPurposes"
                label="Do these third parties use the data for their own purposes?"
                control={control}
                name="thirdPartiesUseForOwnPurposes"
              />

              {thirdPartiesUseForOwnPurposes && (
                <div className="ml-6 mt-2">
                  <Label htmlFor="thirdPartyPurposesSpecify">
                    What types of purposes?
                  </Label>
                  <Controller
                    control={control}
                    name="thirdPartyPurposesSpecify"
                    rules={{
                      required: thirdPartiesUseForOwnPurposes
                        ? "Please specify third party purposes"
                        : false,
                    }}
                    render={({ field }) => (
                      <Input
                        id="thirdPartyPurposesSpecify"
                        className="mt-1"
                        placeholder="Third party usage purposes"
                        {...field}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

const LegalSection = ({ control, watch, isActive, isCompleted, description }: SectionProps) => {
  const compliesWithOther = watch('compliesWithOther');

  return (
    <FormSection
      title="Legal & Rights"
      isActive={isActive}
      isCompleted={isCompleted}
      description={description}
    >
      <div className="space-y-4">
        <p className="text-sm font-medium">
          Which privacy laws and regulations apply to your business?
        </p>
        <CheckboxField
          id="compliesWithGDPR"
          label="GDPR (General Data Protection Regulation - EU)"
          control={control}
          name="compliesWithGDPR"
        />
        <CheckboxField
          id="compliesWithCCPA"
          label="CCPA (California Consumer Privacy Act - USA)"
          control={control}
          name="compliesWithCCPA"
        />
        <CheckboxField
          id="compliesWithOther"
          label="Other"
          control={control}
          name="compliesWithOther"
        />

        {compliesWithOther && (
          <div className="ml-6 mt-2">
            <Label htmlFor="compliesWithOtherSpecify">
              Please specify:
            </Label>
            <Controller
              control={control}
              name="compliesWithOtherSpecify"
              rules={{
                required: compliesWithOther
                  ? "Please specify other regulations"
                  : false,
              }}
              render={({ field }) => (
                <Input
                  id="compliesWithOtherSpecify"
                  className="mt-1"
                  placeholder="Other regulations"
                  {...field}
                />
              )}
            />
          </div>
        )}
      </div>
    </FormSection>
  );
};

const ReviewSection = ({ control, watch, isActive, isCompleted, description, setActiveTab }: SectionProps) => (
  <FormSection
    title="Review"
    isActive={isActive}
    isCompleted={isCompleted}
    description={description}
  >
    <FormSummary 
      data={watch()} 
      onEdit={setActiveTab}
      className="mt-6"
    />
  </FormSection>
);

export function PrivacyPolicyForm({
  onSubmit,
  message: initialMessage,
}: PrivacyPolicyFormProps) {
  const [message, setMessage] = useState<Message | null>(initialMessage || null);
  const [activeTab, setActiveTab] = useState("general");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Define base sections
  const baseSections: Section[] = [
    { 
      name: 'General Information', 
      id: 'general',
      description: 'Basic information about your business and website'
    },
    { 
      name: 'Data Collection', 
      id: 'data',
      description: 'Specify what personal information you collect from users'
    },
    { 
      name: 'Data Sharing', 
      id: 'sharing',
      description: 'Explain how and with whom you share user data'
    },
    { 
      name: 'Legal & Rights', 
      id: 'legal',
      description: 'Legal compliance and user rights information'
    },
    { 
      name: 'Data Usage', 
      id: 'dataUsage',
      description: 'How you use the collected information'
    },
    { 
      name: 'Cookie Usage', 
      id: 'cookies',
      description: 'Your website\'s cookie policy and tracking technologies'
    },
    { 
      name: 'Data Retention', 
      id: 'retention',
      description: 'How long you keep different types of data'
    },
    { 
      name: 'Policy Updates', 
      id: 'updates',
      description: 'How you handle privacy policy changes'
    },
    { 
      name: 'Review', 
      id: 'review',
      description: 'Review and confirm your privacy policy settings'
    }
  ];

  // Now we can use baseSections in our state initialization
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>([baseSections[0].name]);

  // Create sections with status
  const formSections: SectionStatus[] = baseSections.map(section => ({
    ...section,
    completed: completedSections.includes(section.id),
    current: activeTab === section.id
  }));

  const totalSteps = 9;
  const currentStep = {
    general: 1,
    data: 2,
    sharing: 3,
    legal: 4,
    dataUsage: 5,
    cookies: 6,
    retention: 7,
    updates: 8,
    review: 9,
  }[activeTab] || 1;

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm<PolicyFormData>({
    defaultValues: getSavedData('privacy-policy-form') || defaultValues,
    mode: 'onChange',
  });

  const formData = watch();
  const { lastSaved, clearSaved } = useAutosave('privacy-policy-form', formData);

  // Handle form submission
  const submitForm = async (data: PolicyFormData) => {
    if (!data.acknowledgeNotLegalAdvice) {
      setMessage({
        type: "error",
        text: "Please acknowledge that this privacy policy is not legal advice before proceeding."
      });
      return;
    }
    try {
      await onSubmit(data);
      clearSaved();
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({
        type: "error",
        text: "An error occurred while generating your privacy policy. Please try again."
      });
    }
  };

  // Create a type-safe version of dirtyFields
  const getDirtyStatus = (field: keyof PolicyFormData) => {
    const value = dirtyFields[field];
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(Boolean);
    }
    return !!value;
  };

  // Update navigation handlers
  const handlePrevTab = () => {
    const prevTab = {
      data: 'general',
      sharing: 'data',
      legal: 'sharing',
      dataUsage: 'legal',
      cookies: 'dataUsage',
      retention: 'cookies',
      updates: 'retention',
      review: 'updates',
    }[activeTab];
    if (prevTab) setActiveTab(prevTab);
  };

  const handleNextTab = () => {
    const nextTab = {
      general: 'data',
      data: 'sharing',
      sharing: 'legal',
      legal: 'dataUsage',
      dataUsage: 'cookies',
      cookies: 'retention',
      retention: 'updates',
      updates: 'review',
    }[activeTab];
    if (nextTab) setActiveTab(nextTab);
  };

  useSwipeNavigation({
    onSwipeLeft: handleNextTab,
    onSwipeRight: handlePrevTab,
  });

  useKeyboardNavigation(activeTab, setActiveTab);

  const collectsPersonalInfo = watch("collectsPersonalInfo");
  const sharesWithThirdParties = watch("sharesWithThirdParties");
  const thirdPartiesUseForOwnPurposes = watch("thirdPartiesUseForOwnPurposes");
  const collectsOther = watch("collectsOther");
  const usesForOther = watch("usesForOther");
  const sharesWithOther = watch("sharesWithOther");
  const usesCookies = watch("usesCookies");
  const usesOtherCookies = watch("usesOtherCookies");
  const storesDataIndefinitely = watch("storesDataIndefinitely");
  const compliesWithOther = watch("compliesWithOther");

  const handleSaveAndContinue = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (!completedSections.includes(activeTab)) {
        setCompletedSections([...completedSections, activeTab]);
      }
      handleNextTab();
      
      // Find the next section and set it as active in the accordion
      const nextTab = {
        general: 'data',
        data: 'sharing',
        sharing: 'legal',
        legal: 'dataUsage',
        dataUsage: 'cookies',
        cookies: 'retention',
        retention: 'updates',
        updates: 'review',
      }[activeTab];

      if (nextTab) {
        const accordionValue = formSections.find(s => s.id === nextTab)?.name || '';
        setActiveAccordionItems(prev => [...prev, accordionValue]);
      }
    }
  };

  // Add keyboard handler for enter key
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && activeTab !== 'review') {
      event.preventDefault();
      handleSaveAndContinue();
    }
  }, [activeTab, handleSaveAndContinue]);

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Update getValidationStatus to include new sections
  const getValidationStatus = () => {
    if (activeTab === 'review') {
      return [];
    }

    const requiredFields = {
      general: [
        { field: 'Business Name', name: 'businessName' as keyof PolicyFormData },
        { field: 'Website URL', name: 'websiteUrl' as keyof PolicyFormData },
        { field: 'Contact Email', name: 'contactEmail' as keyof PolicyFormData },
      ],
      data: [
        { field: 'Data Collection Status', name: 'collectsPersonalInfo' as keyof PolicyFormData },
        ...(collectsPersonalInfo ? [
          { field: 'Data Types', name: 'collectsName' as keyof PolicyFormData },
        ] : []),
      ],
      sharing: [
        { field: 'Third Party Sharing Status', name: 'sharesWithThirdParties' as keyof PolicyFormData },
        ...(sharesWithThirdParties ? [
          { field: 'Third Party Types', name: 'sharesWithAnalytics' as keyof PolicyFormData },
        ] : []),
      ],
      legal: [
        { field: 'Legal Compliance', name: 'compliesWithGDPR' as keyof PolicyFormData },
      ],
      dataUsage: [
        { field: 'Data Usage Purposes', name: 'dataUsagePurposes' as keyof PolicyFormData },
      ],
      cookies: [
        { field: 'Cookie Usage', name: 'usesCookies' as keyof PolicyFormData },
        ...(usesCookies ? [
          { field: 'Cookie Types', name: 'cookieTypes' as keyof PolicyFormData },
        ] : []),
      ],
      retention: [
        { field: 'Data Retention Periods', name: 'dataRetentionPeriods' as keyof PolicyFormData },
      ],
      updates: [
        { field: 'Update Notification Method', name: 'policyUpdateNotification' as keyof PolicyFormData },
        { field: 'Grace Period', name: 'gracePeriod' as keyof PolicyFormData },
      ],
    }[activeTab] || [];

    return requiredFields.map(({ field, name }) => ({
      field,
      isValid: getFieldValidationStatus(name, dirtyFields, errors),
      message: errors[name]?.message,
    }));
  };

  // Update component rendering to use SectionComponentProps
  const renderSectionComponent = (section: SectionStatus) => {
    const SectionComponent = {
      general: GeneralSection,
      data: DataCollectionSection,
      sharing: DataSharingSection,
      legal: LegalSection,
      dataUsage: DataUsageSection,
      cookies: CookieSection,
      retention: DataRetentionSection,
      updates: PolicyUpdatesSection,
      review: ReviewSection
    }[section.id] as React.ComponentType<SectionComponentProps>;

    if (!SectionComponent) return null;

    return (
      <SectionComponent
        key={section.id}
        control={control}
        watch={watch}
        isActive={section.current}
        isCompleted={section.completed}
        description={section.description}
        setActiveTab={setActiveTab}
      />
    );
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto bg-background">
        <LegalDisclaimer />
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
                {lastSaved && (
                  <p className="text-sm text-gray-500">
                    Last saved: {format(lastSaved, 'HH:mm')}
                  </p>
                )}
              </div>

              <KeyboardHelp />
              
              <Accordion 
                type="multiple" 
                value={activeAccordionItems}
                onValueChange={setActiveAccordionItems}
                className="space-y-2"
              >
                {formSections.map(renderSectionComponent)}
              </Accordion>

              {activeTab === 'review' && (
                <FormSummary 
                  data={formData} 
                  onEdit={setActiveTab}
                  className="mt-6"
                />
              )}
            </div>

            <div className="hidden md:flex md:flex-col md:gap-6">
              <div className="sticky top-6">
                <FormCompletionStatus sections={formSections} />
                <div className="mt-6">
                  <FormValidationStatus validations={getValidationStatus()} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <Controller
              control={control}
              name="acknowledgeNotLegalAdvice"
              rules={{ required: "You must acknowledge this before proceeding" }}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <CheckboxField
                    id="acknowledgeNotLegalAdvice"
                    label="I acknowledge that this generated privacy policy is not legal advice and should be reviewed by a legal professional."
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevTab}
              disabled={activeTab === 'general'}
            >
              Previous
            </Button>

            {activeTab === 'review' ? (
              <Button 
                type="submit"
                disabled={!watch('acknowledgeNotLegalAdvice')}
              >
                Generate Policy
              </Button>
            ) : (
              <Button type="button" onClick={handleSaveAndContinue}>
                Save & Continue
              </Button>
            )}
          </div>

          {message && (
            <FormMessage 
              message={message} 
              role="alert"
              aria-live="polite"
            />
          )}
        </form>

        {/* Update mobile progress indicator */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <FloatingActionButton />
      </div>
    </TooltipProvider>
  );
}

// Update the policy display component to show LAST UPDATED in all caps
const PolicyDisplay = ({ policy }: { policy: GeneratedPolicy }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 className="text-xl font-semibold mb-4">
      {policy.title}
    </h2>
    <p className="text-sm text-gray-500 mb-6 font-bold">
      LAST UPDATED: {policy.lastUpdated}
    </p>
    {/* ... rest of the display ... */}
  </div>
);
