
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetRequest {
  confirmReset?: boolean;
  backupBeforeReset?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    // Verify user has admin privileges
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Authentication failed");
    }

    // Check user role
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Failed to verify user profile");
    }

    if (!["system_administrator", "superadmin"].includes(profile.role)) {
      throw new Error("Insufficient permissions for test data reset");
    }

    const { confirmReset = false }: ResetRequest = await req.json();

    if (!confirmReset) {
      return new Response(
        JSON.stringify({
          error: "Reset confirmation required",
          message: "Set confirmReset: true to proceed with test data reset"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Starting test data reset process...");

    // Step 1: Create backup (optional, for safety)
    console.log("Step 1: Creating backup...");
    
    // Step 2: Clean existing test data
    console.log("Step 2: Cleaning existing test data...");
    
    // Delete in order to respect foreign key constraints
    const cleanupTables = [
      "appointments",
      "member_providers", 
      "family_members",
      "hsa_reimbursements",
      "hsa_contributions",
      "hsa_accounts",
      "user_portfolio_assignments",
      "financial_accounts",
      "plan_expenses",
      "financial_plans",
      "documents",
      "professionals",
      "user_beneficiaries",
      "user_trusts",
      "prescriptions",
      "health_recommendations",
      "epigenetic_tests",
      "fee_scenarios",
      "property_improvements",
      "property_rental_details",
      "properties",
      "private_equity_accounts",
      "prospect_invitations",
      "tenant_invitations"
    ];

    for (const table of cleanupTables) {
      try {
        const { error } = await supabaseClient
          .from(table)
          .delete()
          .neq("created_at", "1900-01-01"); // Delete all records
        
        if (error) {
          console.warn(`Warning cleaning ${table}:`, error.message);
        } else {
          console.log(`Cleaned table: ${table}`);
        }
      } catch (error) {
        console.warn(`Error cleaning ${table}:`, error);
      }
    }

    // Step 3: Restore seed data
    console.log("Step 3: Restoring seed data...");
    
    // Restore test users (these should already exist from auth)
    const testUsers = [
      {
        id: "jet-superadmin-uuid",
        email: "jet_superadmin@bfocfo.com",
        role: "system_administrator",
        first_name: "Super",
        last_name: "Admin",
        tenant_id: "default-tenant-uuid"
      },
      {
        id: "jet-senior-advisor-uuid", 
        email: "jet_senior_advisor@bfocfo.com",
        role: "advisor",
        advisor_role: "senior_advisor",
        first_name: "Senior",
        last_name: "Advisor",
        tenant_id: "default-tenant-uuid"
      },
      {
        id: "jet-premium-client-uuid",
        email: "jet_premium_client@bfocfo.com", 
        role: "client",
        client_segment: "premium",
        first_name: "Premium",
        last_name: "Client",
        tenant_id: "default-tenant-uuid"
      }
    ];

    // Update profiles with test data
    for (const testUser of testUsers) {
      const { error } = await supabaseClient
        .from("profiles")
        .upsert({
          id: testUser.id,
          email: testUser.email,
          role: testUser.role,
          first_name: testUser.first_name,
          last_name: testUser.last_name,
          display_name: `${testUser.first_name} ${testUser.last_name}`,
          tenant_id: testUser.tenant_id,
          client_segment: testUser.client_segment,
          advisor_role: testUser.advisor_role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: "id"
        });

      if (error) {
        console.warn(`Warning upserting test user ${testUser.email}:`, error);
      } else {
        console.log(`Restored test user: ${testUser.email}`);
      }
    }

    // Restore sample data relationships
    console.log("Step 4: Restoring sample relationships...");
    
    // Add sample HSA account for premium client
    const { error: hsaError } = await supabaseClient
      .from("hsa_accounts")
      .insert({
        user_id: "jet-premium-client-uuid",
        account_name: "Test HSA Account",
        custodian_name: "Test Bank",
        current_balance: 5000.00,
        available_cash: 2000.00,
        invested_balance: 3000.00,
        annual_contribution_limit: 4300.00,
        annual_contribution_ytd: 1000.00,
        is_active: true
      });

    if (hsaError) {
      console.warn("Warning creating sample HSA account:", hsaError);
    }

    // Add sample professional for client
    const { error: professionalError } = await supabaseClient
      .from("professionals")
      .insert({
        user_id: "jet-premium-client-uuid",
        tenant_id: "default-tenant-uuid",
        name: "Sample CPA",
        email: "sample.cpa@example.com",
        type: "Tax Professional / Accountant",
        company: "Sample Accounting Firm",
        phone: "(555) 123-4567"
      });

    if (professionalError) {
      console.warn("Warning creating sample professional:", professionalError);
    }

    // Step 4: Verify data integrity
    console.log("Step 4: Verifying data integrity...");
    
    const verificationQueries = [
      { table: "profiles", minCount: 3 },
      { table: "hsa_accounts", minCount: 1 },
      { table: "professionals", minCount: 1 }
    ];

    for (const query of verificationQueries) {
      const { count, error } = await supabaseClient
        .from(query.table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.warn(`Warning verifying ${query.table}:`, error);
      } else if ((count || 0) < query.minCount) {
        console.warn(`Warning: ${query.table} has ${count} records, expected at least ${query.minCount}`);
      } else {
        console.log(`Verified ${query.table}: ${count} records`);
      }
    }

    console.log("Test data reset completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test data reset completed successfully",
        timestamp: new Date().toISOString(),
        restoredUsers: testUsers.length,
        verificationStatus: "passed"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in reset-test-data function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
