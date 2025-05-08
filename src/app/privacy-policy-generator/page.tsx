"use client";

import { useState, useEffect } from "react";
import {
  PrivacyPolicyForm,
  PolicyFormData,
} from "@/components/PrivacyPolicyForm";
import { PrivacyPolicyDownload } from "@/components/PrivacyPolicyDownload";
import {
  PrivacyPolicyGenerator,
  GeneratedPolicy,
} from "@/services/PrivacyPolicyGenerator";
import { checkUserSubscription } from "@/app/actions";
import { createClient } from "../../../supabase/client";

export default function PrivacyPolicyGeneratorPage() {
  const [generatedPolicy, setGeneratedPolicy] =
    useState<GeneratedPolicy | null>(null);
  const [formData, setFormData] = useState<PolicyFormData | null>(null);
  const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    success?: string;
    error?: string;
    message?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const hasSubscription = await checkUserSubscription(user.id);
        setIsPaidUser(hasSubscription);
      }
    };

    checkSubscription();
  }, []);

  const handleFormSubmit = async (data: PolicyFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const generator = new PrivacyPolicyGenerator(data, isPaidUser);
      const policy = generator.generatePolicy();

      setGeneratedPolicy(policy);
      setFormData(data);
      setMessage({ success: "Privacy policy generated successfully!" });

      // Scroll to the generated policy
      setTimeout(() => {
        const policyElement = document.getElementById("generated-policy");
        if (policyElement) {
          policyElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Error generating policy:", error);
      setMessage({
        error: "Failed to generate privacy policy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy Generator</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Create a customized privacy policy for your website or application by
          filling out the form below.
        </p>

        <PrivacyPolicyForm onSubmit={handleFormSubmit} message={message} />

        {generatedPolicy && formData && (
          <div id="generated-policy" className="mt-12 space-y-8">
            <PrivacyPolicyDownload
              policy={generatedPolicy}
              formData={formData}
              isPaidUser={isPaidUser}
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">
                {generatedPolicy.title}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Last Updated: {generatedPolicy.lastUpdated}
              </p>

              {generatedPolicy.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-medium mb-3">
                    {section.heading}
                  </h3>
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="mb-2 text-gray-700 dark:text-gray-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}

              {!isPaidUser && (
                <div className="mt-8 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    FREE TIER - UPGRADE FOR WATERMARK-FREE POLICIES
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
