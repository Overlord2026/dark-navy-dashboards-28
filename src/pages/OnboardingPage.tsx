import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { analytics } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { goToPricingForFeature } from "@/lib/upgrade";
import { getPersonaCopy } from "@/config/personaCopy";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { EmailVerify } from "./onboarding/steps/EmailVerify";
import { Profile } from "./onboarding/steps/Profile";
import { Household } from "./onboarding/steps/Household";
import { LinkAccounts } from "./onboarding/steps/LinkAccounts";
import { UploadDoc } from "./onboarding/steps/UploadDoc";
import { Goals } from "./onboarding/steps/Goals";
import { InvitePro } from "./onboarding/steps/InvitePro";

type StepKey =
  | "email-verify" | "profile" | "household" | "link-accounts"
  | "upload-doc" | "goals" | "invite-pro";

const STEPS: StepKey[] = [
  "email-verify","profile","household","link-accounts","upload-doc","goals","invite-pro"
];

export default function OnboardingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const persona = (params.get("persona") ?? "family") as "family" | "professional";
  const segment = params.get("segment") ?? "retirees";
  const [active, setActive] = useState<StepKey>(STEPS[0]);
  const [saving, setSaving] = useState(false);

  const copy = useMemo(() => getPersonaCopy(persona, segment), [persona, segment]);
  const currentStep = STEPS.indexOf(active) + 1;

  useEffect(() => {
    analytics.trackEvent("onboarding.viewed", { persona, segment });
  }, [persona, segment]);

  async function markComplete(step: StepKey, data: Record<string, any> = {}) {
    setSaving(true);
    const { data: user } = await supabase.auth.getUser();
    const user_id = user?.user?.id;
    if (!user_id) { setSaving(false); return; }

    await supabase
      .from('user_onboarding_progress')
      .upsert(
        { 
          user_id, 
          user_type: persona, 
          step_name: step, 
          is_completed: true, 
          completed_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        },
        { onConflict: 'user_id,user_type,step_name' }
      );

    analytics.trackEvent("onboarding.step_completed", { step, persona, segment });
    setSaving(false);
    const nextIndex = Math.min(STEPS.indexOf(step) + 1, STEPS.length - 1);
    setActive(STEPS[nextIndex]);
    if (nextIndex === STEPS.length - 1) {
      analytics.trackEvent("onboarding.completed", { persona, segment });
    }
  }

  function requirePremium(featureKey: string) {
    goToPricingForFeature(navigate, featureKey, { planHint: "premium", source: "onboarding" });
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{copy.hero}</h1>
        <ul className="mt-4 space-y-2">
          {copy.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span>
              {bullet}
            </li>
          ))}
        </ul>
      </header>

      <OnboardingProgress 
        currentStep={currentStep} 
        totalSteps={STEPS.length} 
        steps={STEPS.map(s => s.replace('-', ' '))} 
        className="mb-6"
      />

      <section className="mt-6">
        {active === "email-verify" && (
          <EmailVerify 
            onComplete={(data) => markComplete("email-verify", data)}
            persona={persona}
            segment={segment}
          />
        )}
        {active === "profile" && (
          <Profile 
            onComplete={(data) => markComplete("profile", data)}
            persona={persona}
            segment={segment}
          />
        )}
        {active === "household" && (
          <Household 
            onComplete={(data) => markComplete("household", data)}
            persona={persona}
            segment={segment}
          />
        )}
        {active === "link-accounts" && (
          <LinkAccounts
            onComplete={(data) => markComplete("link-accounts", data)}
            persona={persona}
            segment={segment}
          />
        )}
        {active === "upload-doc" && (
          <UploadDoc
            onComplete={(data) => markComplete("upload-doc", data)}
            persona={persona}
            segment={segment}
          />
        )}
        {active === "goals" && (
          <Goals 
            onComplete={(data) => markComplete("goals", data)}
            persona={persona}
            segment={segment}
          />
        )}
        {active === "invite-pro" && (
          <InvitePro 
            onComplete={(data) => markComplete("invite-pro", data)}
            persona={persona}
            segment={segment}
          />
        )}
      </section>

      <footer className="mt-6 text-sm opacity-75">{saving ? "Saving…" : null}</footer>
    </div>
  );
}