import { SiteShell } from "@/components/site-shell";
import { Invitation } from "@/components/onboarding-invitation";
export default function Page() {
  return (
    <SiteShell>
      <main id="main" className="page-content">
        <span className="eyebrow">Your TPA account</span>
        <h1>Your next chapter starts here.</h1>
        <p>Activate your invitation to access your private member space.</p>
        <section className="login-panel">
        <h2>Set up your account</h2>
        <Invitation />
        </section>
      </main>
    </SiteShell>
  );
}
