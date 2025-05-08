import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle, CreditCard, FileText, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserPolicies, deleteUserPolicy } from "../actions";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get additional user data from the users table
  const { data: userData } = await supabase
    .from('users')
    .select('subscription, created_at, full_name')
    .eq('user_id', user.id)
    .single();

  // Get user's saved policies
  const policiesResult = await getUserPolicies(user.id);
  const userPolicies = policiesResult.success ? policiesResult.policies || [] : [];

  // Determine if user can create more policies based on subscription
  const isFreeUser = userData?.subscription === 'Free';
  const canCreateMorePolicies = !isFreeUser || userPolicies.length === 0;

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>This is a protected page only visible to authenticated users</span>
            </div>
          </header>

          {/* User Profile Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">User Profile</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{userData?.full_name || user?.user_metadata?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Not available'}</p>
                  </div>
                </div>
              </div>
              
              {/* Subscription Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Subscription Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Current Plan:</p>
                    <Badge variant={userData?.subscription === 'Free' ? 'secondary' : 'default'}>
                      {userData?.subscription || 'No subscription'}
                    </Badge>
                  </div>
                  
                  {userData?.subscription === 'Free' && (
                    <div className="pt-2">
                      <a 
                        href="/pricing" 
                        className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Upgrade Plan
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          {/* Your Policies Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Your Policies</h2>
              {isFreeUser && userPolicies.length >= 1 && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Free tier: 1 policy limit reached
                </Badge>
              )}
            </div>
            
            {userPolicies.length > 0 ? (
              <div className="space-y-4">
                {userPolicies.map((policy: any) => (
                  <div 
                    key={policy.id} 
                    className="p-4 border rounded-lg bg-background flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                      <div>
                        <h3 className="font-medium">{policy.policy_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {new Date(policy.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <form action={async () => {
                        'use server';
                        await deleteUserPolicy(user.id, policy.id);
                      }}>
                        <Button 
                          type="submit"
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </form>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a
                          href={`/privacy-policy/${policy.id}`}
                          className="text-xs"
                        >
                          View Policy
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't created any policies yet.</p>
              </div>
            )}
            
            {/* Call to action button */}
            <div className="mt-6">
              {canCreateMorePolicies ? (
                <a 
                  href="/privacy-policy-generator" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create New Policy
                </a>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Free tier users can only create one policy. Upgrade your plan to create more!
                  </p>
                  <a 
                    href="/pricing" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Upgrade Plan
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
