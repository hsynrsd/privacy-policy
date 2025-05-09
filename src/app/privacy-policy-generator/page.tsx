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
import { checkUserSubscription, getUserPolicies } from "@/app/actions";
import { createClient } from "../../../supabase/client";
import ClientNavbar from "@/components/client-navbar";
import { useRouter } from "next/navigation";
import { Message } from "@/components/form-message";

export default function PrivacyPolicyGeneratorPage() {
  const [generatedPolicy, setGeneratedPolicy] =
    useState<GeneratedPolicy | null>(null);
  const [formData, setFormData] = useState<PolicyFormData | null>(null);
  const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkSubscriptionAndPolicies = async () => {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check subscription
        const hasSubscription = await checkUserSubscription(user.id);
        setIsPaidUser(hasSubscription);
        
        // Check if free user already has policies
        if (!hasSubscription) {
          const policiesResult = await getUserPolicies(user.id);
          if (policiesResult.success && policiesResult.policies && policiesResult.policies.length >= 1) {
            setMessage({
              type: "error",
              text: "Free tier is limited to one policy. Please upgrade your plan to create more."
            });
            // Optional: Redirect to pricing or dashboard after a delay
            setTimeout(() => {
              router.push("/pricing");
            }, 3000);
          }
        }
      }
      setLoading(false);
    };

    checkSubscriptionAndPolicies();
  }, [router]);

  const handleFormSubmit = async (data: PolicyFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const generator = new PrivacyPolicyGenerator(data, isPaidUser);
      const policy = generator.generatePolicy();

      setGeneratedPolicy(policy);
      setFormData(data);
      setMessage({
        type: "success",
        text: "Privacy policy generated successfully!"
      });

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
        type: "error",
        text: "Failed to generate privacy policy. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <div className="container mx-auto py-8 px-4 flex justify-center">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 w-full max-w-lg rounded-md"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy Generator</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Create a customized privacy policy for your website or application by
            filling out the form below.
          </p>

          {message && message.type === "error" && message.text.includes("Free tier is limited") ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md p-4 mb-8">
              <p className="text-yellow-800 dark:text-yellow-200">
                {message.text}
              </p>
              <div className="mt-4">
                <a
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Pricing Plans
                </a>
                <a
                  href="/dashboard"
                  className="ml-4 inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          ) : (
            <PrivacyPolicyForm onSubmit={handleFormSubmit} message={message ?? undefined} />
          )}

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
    </>
  );
}
