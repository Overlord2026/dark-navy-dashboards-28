import { supabase } from "@/integrations/supabase/client";

export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number | null;
  institution: string;
};

export async function listUserAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, account_name, account_type, current_balance, institution_name")
    .eq("account_status", "active")
    .order("institution_name", { ascending: true });

  if (error) throw error;
  
  return (data || []).map(acc => ({
    id: acc.id,
    name: acc.account_name,
    type: acc.account_type,
    balance: acc.current_balance,
    institution: acc.institution_name,
  }));
}

export async function assignAccountsToGoal(goalId: string, accountIds: string[]): Promise<void> {
  // TODO: Implement account assignment table and logic
  console.log("Account assignment not yet implemented", { goalId, accountIds });
}
