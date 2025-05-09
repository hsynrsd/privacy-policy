"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
};

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
};

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

type CheckboxFieldProps = {
  id: string;
  label: string;
  control: any;
  name: keyof PolicyFormData;
};

const CheckboxField = ({ id, label, control, name }: CheckboxFieldProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
};

type PrivacyPolicyFormProps = {
  onSubmit: (data: PolicyFormData) => void;
  message?: Message;
};

export function PrivacyPolicyForm({
  onSubmit,
  message,
}: PrivacyPolicyFormProps) {
  const [activeTab, setActiveTab] = useState("general");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PolicyFormData>({
    defaultValues,
  });

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

  const submitForm = (data: PolicyFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background">
      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="data">Data Collection</TabsTrigger>
            <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
            <TabsTrigger value="legal">Legal & Rights</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <FormSection title="1. General Information">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Controller
                    control={control}
                    name="businessName"
                    rules={{ required: "Business name is required" }}
                    render={({ field }) => (
                      <Input
                        id="businessName"
                        placeholder="Your business or website name"
                        {...field}
                      />
                    )}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-500">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Controller
                    control={control}
                    name="websiteUrl"
                    rules={{ required: "Website URL is required" }}
                    render={({ field }) => (
                      <Input
                        id="websiteUrl"
                        placeholder="https://example.com"
                        {...field}
                      />
                    )}
                  />
                  {errors.websiteUrl && (
                    <p className="text-sm text-red-500">
                      {errors.websiteUrl.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
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
                      <Input
                        id="contactEmail"
                        placeholder="privacy@example.com"
                        {...field}
                      />
                    )}
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-red-500">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveTab("data")}
                className="ml-2"
              >
                Next: Data Collection
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <FormSection title="2. Data Collection">
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
                        {errors.collectsOtherSpecify && (
                          <p className="text-sm text-red-500">
                            {errors.collectsOtherSpecify.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="3. Data Usage">
              <div className="space-y-4">
                <p className="text-sm font-medium">
                  How do you use the collected data? (Select all that apply):
                </p>
                <CheckboxField
                  id="usesForServices"
                  label="Providing and personalizing services"
                  control={control}
                  name="usesForServices"
                />
                <CheckboxField
                  id="usesForMarketing"
                  label="Marketing and promotional purposes"
                  control={control}
                  name="usesForMarketing"
                />
                <CheckboxField
                  id="usesForCommunication"
                  label="Communicating with users (e.g., support, updates)"
                  control={control}
                  name="usesForCommunication"
                />
                <CheckboxField
                  id="usesForLegal"
                  label="Legal obligations or compliance"
                  control={control}
                  name="usesForLegal"
                />
                <CheckboxField
                  id="usesForAnalytics"
                  label="Analytics and performance tracking"
                  control={control}
                  name="usesForAnalytics"
                />
                <CheckboxField
                  id="usesForOther"
                  label="Other"
                  control={control}
                  name="usesForOther"
                />

                {usesForOther && (
                  <div className="ml-6 mt-2">
                    <Label htmlFor="usesForOtherSpecify">Please specify:</Label>
                    <Controller
                      control={control}
                      name="usesForOtherSpecify"
                      rules={{
                        required: usesForOther
                          ? "Please specify other usage"
                          : false,
                      }}
                      render={({ field }) => (
                        <Input
                          id="usesForOtherSpecify"
                          className="mt-1"
                          placeholder="Other ways you use the data"
                          {...field}
                        />
                      )}
                    />
                    {errors.usesForOtherSpecify && (
                      <p className="text-sm text-red-500">
                        {errors.usesForOtherSpecify.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormSection>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => setActiveTab("general")}
                variant="outline"
              >
                Previous: General
              </Button>
              <Button type="button" onClick={() => setActiveTab("sharing")}>
                Next: Data Sharing
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-6">
            <FormSection title="4. Third-Party Sharing">
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
                        {errors.sharesWithOtherSpecify && (
                          <p className="text-sm text-red-500">
                            {errors.sharesWithOtherSpecify.message}
                          </p>
                        )}
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
                          {errors.thirdPartyPurposesSpecify && (
                            <p className="text-sm text-red-500">
                              {errors.thirdPartyPurposesSpecify.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="5. Data Storage and Security">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="dataStorageLocation">
                    Where is user data stored?
                  </Label>
                  <Controller
                    control={control}
                    name="dataStorageLocation"
                    rules={{ required: "Data storage location is required" }}
                    render={({ field }) => (
                      <Input
                        id="dataStorageLocation"
                        placeholder="E.g., in your servers, cloud providers, etc."
                        {...field}
                      />
                    )}
                  />
                  {errors.dataStorageLocation && (
                    <p className="text-sm text-red-500">
                      {errors.dataStorageLocation.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="securityMeasures">
                    What security measures are in place to protect user data?
                  </Label>
                  <Controller
                    control={control}
                    name="securityMeasures"
                    rules={{
                      required: "Security measures information is required",
                    }}
                    render={({ field }) => (
                      <Input
                        id="securityMeasures"
                        placeholder="E.g., encryption, access control, etc."
                        {...field}
                      />
                    )}
                  />
                  {errors.securityMeasures && (
                    <p className="text-sm text-red-500">
                      {errors.securityMeasures.message}
                    </p>
                  )}
                </div>

                <CheckboxField
                  id="storesDataIndefinitely"
                  label="Do you store user data indefinitely?"
                  control={control}
                  name="storesDataIndefinitely"
                />

                {!storesDataIndefinitely && (
                  <div className="grid gap-2">
                    <Label htmlFor="dataRetentionPeriod">
                      How long is user data retained?
                    </Label>
                    <Controller
                      control={control}
                      name="dataRetentionPeriod"
                      rules={{
                        required: !storesDataIndefinitely
                          ? "Data retention period is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <Input
                          id="dataRetentionPeriod"
                          placeholder="E.g., 1 year, 30 days after account deletion, etc."
                          {...field}
                        />
                      )}
                    />
                    {errors.dataRetentionPeriod && (
                      <p className="text-sm text-red-500">
                        {errors.dataRetentionPeriod.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormSection>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => setActiveTab("data")}
                variant="outline"
              >
                Previous: Data Collection
              </Button>
              <Button type="button" onClick={() => setActiveTab("legal")}>
                Next: Legal & Rights
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <FormSection title="6. Cookies and Tracking Technologies">
              <div className="space-y-4">
                <CheckboxField
                  id="usesCookies"
                  label="Do you use cookies or similar technologies to track users?"
                  control={control}
                  name="usesCookies"
                />

                {usesCookies && (
                  <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
                    <p className="text-sm font-medium">
                      What types of cookies are used?
                    </p>
                    <CheckboxField
                      id="usesEssentialCookies"
                      label="Essential Cookies (for functionality)"
                      control={control}
                      name="usesEssentialCookies"
                    />
                    <CheckboxField
                      id="usesAnalyticsCookies"
                      label="Analytics Cookies"
                      control={control}
                      name="usesAnalyticsCookies"
                    />
                    <CheckboxField
                      id="usesAdvertisingCookies"
                      label="Advertising Cookies"
                      control={control}
                      name="usesAdvertisingCookies"
                    />
                    <CheckboxField
                      id="usesSocialCookies"
                      label="Social Media Cookies"
                      control={control}
                      name="usesSocialCookies"
                    />
                    <CheckboxField
                      id="usesOtherCookies"
                      label="Other"
                      control={control}
                      name="usesOtherCookies"
                    />

                    {usesOtherCookies && (
                      <div className="ml-6 mt-2">
                        <Label htmlFor="otherCookiesSpecify">
                          Please specify:
                        </Label>
                        <Controller
                          control={control}
                          name="otherCookiesSpecify"
                          rules={{
                            required: usesOtherCookies
                              ? "Please specify other cookie types"
                              : false,
                          }}
                          render={({ field }) => (
                            <Input
                              id="otherCookiesSpecify"
                              className="mt-1"
                              placeholder="Other cookie types"
                              {...field}
                            />
                          )}
                        />
                        {errors.otherCookiesSpecify && (
                          <p className="text-sm text-red-500">
                            {errors.otherCookiesSpecify.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="7. User Rights and Choices">
              <div className="space-y-4">
                <CheckboxField
                  id="providesUserRights"
                  label="Do users have the right to access, correct, or delete their data?"
                  control={control}
                  name="providesUserRights"
                />

                {watch("providesUserRights") && (
                  <div className="grid gap-2">
                    <Label htmlFor="userRightsProcess">
                      Explain how users can exercise these rights:
                    </Label>
                    <Controller
                      control={control}
                      name="userRightsProcess"
                      rules={{
                        required: watch("providesUserRights")
                          ? "User rights process is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <Input
                          id="userRightsProcess"
                          placeholder="E.g., contact email, form submission, account settings, etc."
                          {...field}
                        />
                      )}
                    />
                    {errors.userRightsProcess && (
                      <p className="text-sm text-red-500">
                        {errors.userRightsProcess.message}
                      </p>
                    )}
                  </div>
                )}

                <CheckboxField
                  id="providesOptOut"
                  label="Do users have the ability to opt-out of data collection?"
                  control={control}
                  name="providesOptOut"
                />

                {watch("providesOptOut") && (
                  <div className="grid gap-2">
                    <Label htmlFor="optOutProcess">
                      Explain how users can opt-out:
                    </Label>
                    <Controller
                      control={control}
                      name="optOutProcess"
                      rules={{
                        required: watch("providesOptOut")
                          ? "Opt-out process is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <Input
                          id="optOutProcess"
                          placeholder="E.g., through settings or preferences, etc."
                          {...field}
                        />
                      )}
                    />
                    {errors.optOutProcess && (
                      <p className="text-sm text-red-500">
                        {errors.optOutProcess.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="8. Legal Compliance">
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
                    {errors.compliesWithOtherSpecify && (
                      <p className="text-sm text-red-500">
                        {errors.compliesWithOtherSpecify.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="9. Changes to the Privacy Policy">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="notificationMethod">
                    How will users be notified about changes to the privacy
                    policy?
                  </Label>
                  <Controller
                    control={control}
                    name="notificationMethod"
                    rules={{ required: "Notification method is required" }}
                    render={({ field }) => (
                      <Input
                        id="notificationMethod"
                        placeholder="E.g., Email, Website Notification, etc."
                        {...field}
                      />
                    )}
                  />
                  {errors.notificationMethod && (
                    <p className="text-sm text-red-500">
                      {errors.notificationMethod.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="effectiveDate">
                    When will changes to the privacy policy take effect?
                  </Label>
                  <Controller
                    control={control}
                    name="effectiveDate"
                    rules={{
                      required: "Effective date information is required",
                    }}
                    render={({ field }) => (
                      <Input
                        id="effectiveDate"
                        placeholder="E.g., Immediately, 30 days after notification, etc."
                        {...field}
                      />
                    )}
                  />
                  {errors.effectiveDate && (
                    <p className="text-sm text-red-500">
                      {errors.effectiveDate.message}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => setActiveTab("sharing")}
                variant="outline"
              >
                Previous: Data Sharing
              </Button>
              <SubmitButton className="bg-primary hover:bg-primary/90">
                Generate Privacy Policy
              </SubmitButton>
            </div>
          </TabsContent>
        </Tabs>

        {message && <FormMessage message={message} />}
      </form>
    </div>
  );
}
