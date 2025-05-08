"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PrivacyPolicyGenerator,
  GeneratedPolicy,
} from "@/services/PrivacyPolicyGenerator";
import { PolicyFormData } from "@/components/PrivacyPolicyForm";
import { createClient } from "../../supabase/client";
import { saveUserPolicy } from "@/app/actions";
import { useRouter } from "next/navigation";

type PrivacyPolicyDownloadProps = {
  policy: GeneratedPolicy;
  formData: PolicyFormData;
  isPaidUser: boolean;
};

export function PrivacyPolicyDownload({
  policy,
  formData,
  isPaidUser,
}: PrivacyPolicyDownloadProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleDownload = async (format: "pdf" | "docx") => {
    setIsDownloading(format);

    try {
      const generator = new PrivacyPolicyGenerator(formData, isPaidUser);

      if (format === "pdf") {
        generator.downloadPDF(policy);
      } else {
        generator.downloadDOCX(policy);
      }
    } catch (error) {
      console.error("Error downloading policy:", error);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleSavePolicy = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setSaveMessage({
          type: "error",
          text: "You must be signed in to save policies.",
        });
        return;
      }

      const policyName = `Privacy Policy for ${formData.businessName}`;
      const result = await saveUserPolicy(
        data.user.id,
        policyName,
        "privacy_policy",
        formData,
        policy
      );

      if (result.success) {
        setSaveMessage({
          type: "success",
          text: "Policy saved successfully!",
        });
        // Refresh the dashboard to show the new policy
        router.refresh();
      } else {
        if (result.redirectToPricing) {
          setSaveMessage({
            type: "error",
            text: "Free tier limited to one policy. Redirecting to pricing page...",
          });
          setTimeout(() => {
            router.push("/pricing");
          }, 2000);
        } else {
          setSaveMessage({
            type: "error",
            text: result.error || "Error saving policy.",
          });
        }
      }
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Error saving policy. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">
        Download Your Privacy Policy
      </h2>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button
          onClick={() => handleDownload("pdf")}
          disabled={isDownloading !== null}
          className="flex items-center justify-center"
        >
          {isDownloading === "pdf" ? "Downloading..." : "Download PDF"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </Button>

        <Button
          onClick={() => handleDownload("docx")}
          disabled={isDownloading !== null}
          variant="outline"
          className="flex items-center justify-center"
        >
          {isDownloading === "docx" ? "Downloading..." : "Download DOCX"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </Button>

        <Button
          onClick={handleSavePolicy}
          disabled={isSaving}
          variant="secondary"
          className="flex items-center justify-center"
        >
          {isSaving ? "Saving..." : "Save Policy"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </Button>
      </div>

      {saveMessage && (
        <div
          className={`mt-4 p-3 rounded-md ${
            saveMessage.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900"
          }`}
        >
          <p
            className={`text-sm ${
              saveMessage.type === "success"
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            {saveMessage.text}
          </p>
        </div>
      )}

      {!isPaidUser && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <span className="font-medium">Note:</span> Free tier downloads
            include a watermark and are limited to one saved policy. Upgrade to remove watermarks and save multiple policies.
          </p>
        </div>
      )}
    </div>
  );
}
