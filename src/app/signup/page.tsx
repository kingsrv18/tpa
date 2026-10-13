import { SiteShell } from "@/components/site-shell";
import { Signup } from "@/components/onboarding-auth";
import { redirect } from "next/navigation";
import { currentActor } from "@/lib/actor";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (await currentActor()) redirect("/member");
  return (
    <SiteShell>
      <main id="main" className="page-content">
        <span className="eyebrow">Your TPA account</span>
        <h1>Find your place here.</h1>
        <p>Your account is the starting point for your professional journey with TPA.</p>
        <section className="login-panel">
        <h2>Create your account</h2>
        {process.env.ONBOARDING_ENABLED === "true" ? (
          <Signup />
        ) : (
          <p>Account registration is not available yet.</p>
        )}
        </section>
      </main>
    </SiteShell>
  );
}
