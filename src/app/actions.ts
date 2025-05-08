"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        email: email,
      }
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {

      const { error: updateError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          user_id: user.id,
          name: fullName,
          email: email,
          token_identifier: user.id,
          created_at: new Date().toISOString()
        });

      if (updateError) {
        // Error handling without console.error
        return encodedRedirect(
          "error",
          "/sign-up",
          "Error updating user. Please try again.",
        );
      }
    } catch (err) {
      // Error handling without console.error
      return encodedRedirect(
        "error",
        "/sign-up",
        "Error updating user. Please try again.",
      );
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  // First check if user has a 'Free' subscription in users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('subscription')
    .eq('user_id', userId)
    .single();

  if (userError) {
    console.error('Error checking user subscription:', userError);
    return false;
  }

  // If user has a 'Free' subscription, they're considered subscribed
  if (userData?.subscription === 'Free') {
    return true;
  }

  // If not free, check for active paid subscription
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error checking paid subscription:', error);
    return false;
  }

  return !!subscription;
};

export const saveUserPolicy = async (
  userId: string,
  policyName: string,
  policyType: string,
  formData: any,
  policyContent: any
) => {
  const supabase = await createClient();

  try {
    // Check how many policies the user already has
    const { data: existingPolicies, error: countError } = await supabase
      .from('user_policies')
      .select('id')
      .eq('user_id', userId);

    if (countError) {
      return { success: false, error: 'Error checking existing policies' };
    }

    // Check if user is on free plan and already has a policy
    const { data: userData } = await supabase
      .from('users')
      .select('subscription')
      .eq('user_id', userId)
      .single();

    // Only allow one policy for free users
    if (userData?.subscription === 'Free' && existingPolicies && existingPolicies.length >= 1) {
      return { 
        success: false, 
        error: 'Free tier limited to one policy. Please upgrade for more.',
        redirectToPricing: true
      };
    }

    // Check if policy with same name already exists for this user
    const { data: existingPolicy } = await supabase
      .from('user_policies')
      .select('id')
      .eq('user_id', userId)
      .eq('policy_name', policyName)
      .eq('policy_type', policyType)
      .single();

    // Insert or update the policy
    let result;
    if (existingPolicy) {
      // Update existing policy
      result = await supabase
        .from('user_policies')
        .update({
          business_name: formData.businessName,
          website_url: formData.websiteUrl,
          contact_email: formData.contactEmail,
          data_collected: formData,
          policy_content: policyContent,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingPolicy.id);
    } else {
      // Insert new policy
      result = await supabase
        .from('user_policies')
        .insert({
          user_id: userId,
          policy_name: policyName,
          policy_type: policyType,
          business_name: formData.businessName,
          website_url: formData.websiteUrl,
          contact_email: formData.contactEmail,
          data_collected: formData,
          policy_content: policyContent
        });
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};

export const getUserPolicies = async (userId: string) => {
  const supabase = await createClient();

  try {
    const { data: policies, error } = await supabase
      .from('user_policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, policies };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};

export const deleteUserPolicy = async (userId: string, policyId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('user_policies')
      .delete()
      .eq('id', policyId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};
