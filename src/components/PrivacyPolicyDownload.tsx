"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PrivacyPolicyGenerator,
  GeneratedPolicy,
} from "@/services/PrivacyPolicyGenerator";
import { PolicyFormData } from "@/components/PrivacyPolicyForm";

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">
        Download Your Privacy Policy
      </h2>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
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
      </div>

      {!isPaidUser && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <span className="font-medium">Note:</span> Free tier downloads
            include a watermark. Upgrade to remove watermarks and access
            additional features.
          </p>
        </div>
      )}
    </div>
  );
}
