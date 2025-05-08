import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ViewPrivacyPolicy({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get the policy details
  const { data: policy, error } = await supabase
    .from('user_policies')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !policy) {
    return redirect("/dashboard");
  }

  const policyContent = policy.policy_content as any;

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold mb-2">{policyContent.title}</h1>
            <p className="text-sm text-gray-500 mb-6">
              Last Updated: {policyContent.lastUpdated}
            </p>

            {policyContent.sections.map((section: any, index: number) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-medium mb-3">{section.heading}</h2>
                {section.content.map((paragraph: string, pIndex: number) => (
                  <p key={pIndex} className="mb-3 text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}

            <div className="flex justify-end mt-8">
              <Button asChild>
                <Link href={`/privacy-policy-generator`}>
                  Create New Policy
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 