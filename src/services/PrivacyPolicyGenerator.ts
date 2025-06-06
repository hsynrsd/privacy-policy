import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { PolicyFormData } from "@/components/PrivacyPolicyForm";

export type GeneratedPolicy = {
  title: string;
  sections: {
    heading: string;
    content: string[];
  }[];
  lastUpdated: string;
};

export class PrivacyPolicyGenerator {
  private formData: PolicyFormData;
  private isPaidUser: boolean;

  constructor(formData: PolicyFormData, isPaidUser: boolean = false) {
    this.formData = formData;
    this.isPaidUser = isPaidUser;
  }

  public generatePolicy(): GeneratedPolicy {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      title: `Privacy Policy for ${this.formData.businessName}`,
      sections: [
        this.generateIntroduction(),
        this.generateDataCollection(),
        this.generateDataUsage(),
        this.generateThirdPartySharing(),
        this.generateDataStorage(),
        this.generateCookiesSection(),
        this.generateUserRights(),
        this.generateLegalCompliance(),
        this.generatePolicyChanges(),
        this.generateContactInformation(),
      ],
      lastUpdated: currentDate,
    };
  }

  public async generatePDF(policy: GeneratedPolicy): Promise<Blob> {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const titleWidth =
      (doc.getStringUnitWidth(policy.title) * 18) / doc.internal.scaleFactor;
    doc.text(policy.title, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 15;

    // Last updated
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const lastUpdatedText = `Last Updated: ${policy.lastUpdated}`;
    doc.text(lastUpdatedText, 20, yPosition);
    yPosition += 15;

    // Sections
    for (const section of policy.sections) {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      // Section heading
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(section.heading, 20, yPosition);
      yPosition += 10;

      // Section content
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      for (const paragraph of section.content) {
        const lines = doc.splitTextToSize(paragraph, pageWidth - 40);

        for (const line of lines) {
          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.text(line, 20, yPosition);
          yPosition += 6;
        }

        yPosition += 4; // Space between paragraphs
      }

      yPosition += 5; // Space between sections
    }

    // Add watermark for free tier users
    if (!this.isPaidUser) {
      const watermarkText = "FREE TIER - UPGRADE FOR WATERMARK-FREE POLICIES";
      doc.setFontSize(12);
      doc.setTextColor(200, 200, 200); // Light gray
      doc.setFont("helvetica", "italic");

      // Add watermark diagonally across each page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(watermarkText, 30, 150, { angle: 45 });
      }

      // Reset text color
      doc.setTextColor(0, 0, 0);
    }

    return doc.output("blob");
  }

  public async generateDOCX(policy: GeneratedPolicy): Promise<Blob> {
    const children = [];

    // Title
    children.push(
      new Paragraph({
        text: policy.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
    );

    // Last updated
    children.push(
      new Paragraph({
        text: `Last Updated: ${policy.lastUpdated}`,
        alignment: AlignmentType.LEFT,
        spacing: {
          after: 400,
        },
      }),
    );

    // Sections
    for (const section of policy.sections) {
      // Section heading
      children.push(
        new Paragraph({
          text: section.heading,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),
      );

      // Section content
      for (const paragraph of section.content) {
        children.push(
          new Paragraph({
            text: paragraph,
            spacing: {
              after: 200,
            },
          }),
        );
      }
    }

    // Add watermark for free tier users
    if (!this.isPaidUser) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "FREE TIER - UPGRADE FOR WATERMARK-FREE POLICIES",
              color: "#CCCCCC",
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 800,
          },
        }),
      );
    }

    const doc = new Document({
      sections: [{
        children: children,
      }],
    });

    return await Packer.toBlob(doc);
  }

  private generateIntroduction(): { heading: string; content: string[] } {
    return {
      heading: "1. Introduction",
      content: [
        `${this.formData.businessName} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ${this.formData.websiteUrl} (the "Site").`,
        "Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.",
        "We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the 'Last Updated' date of this Privacy Policy.",
        `You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Site after the date such revised Privacy Policy is posted.`,
        `Our Site is not intended for individuals under the age of ${this.formData.minimumAge || "13"} ${this.formData.parentalConsentRequired ? "without parental consent" : ""}, and we do not knowingly collect personal data from children.`,
      ],
    };
  }

  private generateDataCollection(): { heading: string; content: string[] } {
    const content = [];

    if (this.formData.collectsPersonalInfo) {
      content.push(
        "We may collect personal information that you voluntarily provide to us when you use our Site.",
      );

      const dataTypes = [];
      if (this.formData.collectsName) dataTypes.push("Name");
      if (this.formData.collectsEmail) dataTypes.push("Email address");
      if (this.formData.collectsPhone) dataTypes.push("Phone number");
      if (this.formData.collectsPayment)
        dataTypes.push(
          "Payment information (credit card numbers, billing addresses)",
        );
      if (this.formData.collectsLocation) dataTypes.push("Location data");
      if (this.formData.collectsIp) dataTypes.push("IP addresses");
      if (this.formData.collectsCookies)
        dataTypes.push(
          "Information collected through cookies and similar technologies",
        );
      if (this.formData.collectsOther && this.formData.collectsOtherSpecify) {
        dataTypes.push(this.formData.collectsOtherSpecify);
      }

      if (dataTypes.length > 0) {
        content.push(
          "The personal information we may collect includes: " +
            dataTypes.join(", ") +
            ".",
        );
      }
    } else {
      content.push(
        "We do not collect personal information from visitors to our Site.",
      );
    }

    return {
      heading: "2. Information We Collect",
      content,
    };
  }

  private generateDataUsage(): { heading: string; content: string[] } {
    const content = [];
    const usageTypes = [];

    if (this.formData.collectsPersonalInfo) {
      if (this.formData.dataUsagePurposes.userCommunication) {
        usageTypes.push("To communicate with users, including sending emails, notifications, and providing customer support");
      }
      if (this.formData.dataUsagePurposes.paymentProcessing) {
        usageTypes.push("To process payments, handle billing, and manage subscriptions");
      }
      if (this.formData.dataUsagePurposes.analytics) {
        usageTypes.push("To analyze usage patterns and track site performance to improve our services");
      }
      if (this.formData.dataUsagePurposes.serviceImprovement) {
        usageTypes.push("To enhance and improve our features, functionality, and user experience");
      }
      if (this.formData.dataUsagePurposes.marketing) {
        usageTypes.push("To send marketing and promotional communications");
      }
      if (this.formData.dataUsagePurposes.other && this.formData.dataUsageOtherSpecify) {
        usageTypes.push(this.formData.dataUsageOtherSpecify);
      }

      if (usageTypes.length > 0) {
        content.push("We use the information we collect from you for the following purposes:");
        content.push(usageTypes.join("; ") + ".");
      } else {
        content.push("We collect personal information but have not specified any usage purposes. Please contact us for more information about how we use your data.");
      }
    } else {
      content.push("We do not collect personal information, therefore we do not use your data for any purpose.");
    }

    return {
      heading: "3. How We Use Your Information",
      content,
    };
  }

  private generateThirdPartySharing(): { heading: string; content: string[] } {
    const content = [];

    if (this.formData.sharesWithThirdParties) {
      content.push(
        "We may share the information we collect in various ways, including:",
      );

      const sharingTypes = [];
      if (this.formData.sharesWithAnalytics)
        sharingTypes.push(
          "With analytics providers who help us understand how you use our Site",
        );
      if (this.formData.sharesWithAdvertising)
        sharingTypes.push(
          "With advertising networks to display relevant advertisements to you",
        );
      if (this.formData.sharesWithPayment)
        sharingTypes.push(
          "With payment processors to securely process your payments",
        );
      if (this.formData.sharesWithSocial)
        sharingTypes.push(
          "With social media platforms when you interact with our content on those platforms",
        );
      if (
        this.formData.sharesWithOther &&
        this.formData.sharesWithOtherSpecify
      ) {
        sharingTypes.push(this.formData.sharesWithOtherSpecify);
      }

      if (sharingTypes.length > 0) {
        content.push(sharingTypes.join("; ") + ".");
      }

      if (this.formData.thirdPartiesUseForOwnPurposes) {
        content.push(
          `These third parties may use this information for their own purposes, including: ${this.formData.thirdPartyPurposesSpecify || "various business purposes"}`,
        );
      } else {
        content.push(
          "These third parties are only permitted to use your information to provide services to us and are not authorized to use your information for their own purposes.",
        );
      }
    } else {
      content.push(
        "We do not share your personal information with third parties except as required by law.",
      );
    }

    return {
      heading: "4. Disclosure of Your Information",
      content,
    };
  }

  private generateDataStorage(): { heading: string; content: string[] } {
    const content = [];

    content.push(
      `Your information is stored ${this.formData.dataStorageLocation || "on our secure servers"}.`,
    );
    content.push(
      `We use ${this.formData.securityMeasures || "industry standard security measures"} to protect your personal information.`,
    );

    if (this.formData.storesDataIndefinitely) {
      content.push(
        "We store your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.",
      );
    } else if (this.formData.dataRetentionPeriods) {
      const periods = [];
      if (this.formData.dataRetentionPeriods.accountData) {
        periods.push(`account data for ${this.formData.dataRetentionPeriods.accountData}`);
      }
      if (this.formData.dataRetentionPeriods.transactionData) {
        periods.push(`transaction records for ${this.formData.dataRetentionPeriods.transactionData}`);
      }
      if (this.formData.dataRetentionPeriods.communicationHistory) {
        periods.push(`communication history for ${this.formData.dataRetentionPeriods.communicationHistory}`);
      }
      if (this.formData.dataRetentionPeriods.analyticsData) {
        periods.push(`analytics data for ${this.formData.dataRetentionPeriods.analyticsData}`);
      }
      
      if (periods.length > 0) {
        content.push("We retain different types of personal information for varying periods:");
        content.push(periods.join("; ") + ".");
      }
      
      content.push(
        "For any data not specifically mentioned above, we retain personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.",
      );
    } else {
      content.push(
        "We retain personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.",
      );
    }

    content.push(
      "Despite our best efforts, no data transmission over the internet or data storage system can be guaranteed to be 100% secure. If you have reason to believe that your interaction with us is no longer secure, please immediately notify us.",
    );

    return {
      heading: "5. Data Security and Retention",
      content,
    };
  }

  private generateCookiesSection(): { heading: string; content: string[] } {
    const content = [];

    if (this.formData.usesCookies) {
      content.push(
        "We use cookies and similar tracking technologies to track activity on our Site and hold certain information.",
      );
      content.push(
        "Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.",
      );
      content.push(
        "Where required by law, we obtain your consent before using cookies or similar tracking technologies.",
      );

      const cookieTypes = [];
      if (this.formData.cookieTypes.essential)
        cookieTypes.push(
          "Essential cookies that are necessary for the Site to function properly",
        );
      if (this.formData.cookieTypes.functional)
        cookieTypes.push(
          "Functional cookies that remember your preferences and customize your experience",
        );
      if (this.formData.cookieTypes.analytics)
        cookieTypes.push(
          "Analytics cookies that help us understand how you use our Site",
        );
      if (this.formData.cookieTypes.advertising)
        cookieTypes.push(
          "Advertising cookies that are used to deliver relevant ads to you",
        );
      if (this.formData.cookieTypes.other && this.formData.cookieOtherSpecify) {
        cookieTypes.push(this.formData.cookieOtherSpecify);
      }

      if (cookieTypes.length > 0) {
        content.push(
          "We use the following types of cookies: " +
            cookieTypes.join("; ") +
            ".",
        );
      }

      content.push(
        "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.",
      );
    } else {
      content.push(
        "We do not use cookies or similar tracking technologies on our Site.",
      );
    }

    return {
      heading: "6. Cookies and Tracking Technologies",
      content,
    };
  }

  private generateUserRights(): { heading: string; content: string[] } {
    const content = [];

    if (this.formData.providesUserRights) {
      content.push(
        "You have the right to access, update, or delete your personal information that we have collected.",
      );
      content.push(
        `To exercise these rights, you can ${this.formData.userRightsProcess || `contact us at ${this.formData.contactEmail} with the subject line 'Privacy Request'`}.`,
      );
    }

    if (this.formData.compliesWithGDPR || this.formData.compliesWithCCPA) {
      content.push(
        `To exercise any of your rights under the ${[
          this.formData.compliesWithGDPR ? "GDPR" : "",
          this.formData.compliesWithCCPA ? "CCPA" : "",
        ].filter(Boolean).join(" or ")}, please contact us at ${this.formData.contactEmail} with the subject line 'Privacy Request'.`,
      );
    }

    if (this.formData.providesOptOut) {
      content.push(
        `You may opt-out of certain data collection and use by ${this.formData.optOutProcess || "contacting us"}.`,
      );
    }

    return {
      heading: "7. Your Privacy Rights",
      content,
    };
  }

  private generateLegalCompliance(): { heading: string; content: string[] } {
    const content = [];
    const regulations = [];

    if (this.formData.compliesWithGDPR) {
      regulations.push("GDPR");
      content.push(
        "If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information.",
      );
      content.push(
        "Under the GDPR, you have the right to: access, rectify, or erase your personal data; restrict or object to processing of your personal data; and data portability. You also have the right to withdraw consent at any time where we relied on your consent to process your personal information.",
      );
    }

    if (this.formData.compliesWithCCPA) {
      regulations.push("CCPA");
      content.push(
        "If you are a resident of California, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA). You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months.",
      );
      content.push(
        "Under the CCPA, you have the right to: know what personal information is being collected about you; know whether your personal information is sold or disclosed and to whom; say no to the sale of personal information; access your personal information; and equal service and price, even if you exercise your privacy rights.",
      );
    }

    if (
      this.formData.compliesWithOther &&
      this.formData.compliesWithOtherSpecify
    ) {
      regulations.push(this.formData.compliesWithOtherSpecify);
      content.push(
        `We also comply with ${this.formData.compliesWithOtherSpecify} and will respect the rights granted to you under these regulations.`,
      );
    }

    if (regulations.length > 0) {
      content.unshift(
        `Our privacy practices comply with the following regulations: ${regulations.join(", ")}.`,
      );
    } else {
      content.push(
        "We comply with all applicable privacy laws and regulations in the jurisdictions where we operate.",
      );
    }

    return {
      heading: "8. Legal Compliance",
      content,
    };
  }

  private generatePolicyChanges(): { heading: string; content: string[] } {
    const content = [];
    
    content.push(
      `We may update our Privacy Policy from time to time. We will notify you of any changes by ${this.formData.notificationMethod || "posting the new Privacy Policy on this page"}.`
    );

    const notificationMethods = [];
    if (this.formData.policyUpdateNotification.email) {
      notificationMethods.push("email (if you've provided it)");
    }
    if (this.formData.policyUpdateNotification.siteNotice) {
      notificationMethods.push("a prominent notice on our Site");
    }
    if (this.formData.policyUpdateNotification.popup) {
      notificationMethods.push("a pop-up notification");
    }
    if (this.formData.policyUpdateNotification.other && this.formData.policyUpdateNotificationOther) {
      notificationMethods.push(this.formData.policyUpdateNotificationOther);
    }

    if (notificationMethods.length > 0) {
      content.push(
        `We will inform you about significant changes via ${notificationMethods.join(" or ")}.`
      );
    }

    content.push(
      `Changes to this Privacy Policy will take effect ${this.formData.gracePeriod ? `after a grace period of ${this.formData.gracePeriod}` : "immediately upon posting"}.`
    );

    return {
      heading: "9. Changes to This Privacy Policy",
      content,
    };
  }

  private generateContactInformation(): { heading: string; content: string[] } {
    return {
      heading: "10. Contact Us",
      content: [
        `If you have any questions about this Privacy Policy, please contact us at:`,
        `${this.formData.businessName}`,
        `${this.formData.websiteUrl}`,
        `${this.formData.contactEmail}`,
      ],
    };
  }

  public downloadPDF(policy: GeneratedPolicy): void {
    this.generatePDF(policy).then((blob) => {
      saveAs(
        blob,
        `${this.formData.businessName.replace(/\s+/g, "-").toLowerCase()}-privacy-policy.pdf`,
      );
    });
  }

  public downloadDOCX(policy: GeneratedPolicy): void {
    this.generateDOCX(policy).then((blob) => {
      saveAs(
        blob,
        `${this.formData.businessName.replace(/\s+/g, "-").toLowerCase()}-privacy-policy.docx`,
      );
    });
  }
}
