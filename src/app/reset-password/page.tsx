import { SiteShell } from "@/components/site-shell";
import { PasswordResetLanding } from "@/components/password-controls";
export const metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default function Page() {
  return (
    <SiteShell>
      <main id="main" className="page-content">
        <span className="eyebrow">Your TPA account</span>
        <h1>A fresh start.</h1>
        <p>Choose a new password to keep your member space secure.</p>
        <section className="login-panel">
          <h2>Choose a new password</h2>
          <PasswordResetLanding />
        </section>
      </main>
    </SiteShell>
  );
}
