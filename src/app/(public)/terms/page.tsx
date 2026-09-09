export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-4">Terms and Conditions</h1>
      <p className="text-xs text-text-muted mb-8">Last updated: September 2026</p>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed bg-bg-card p-8 rounded-2xl border border-border-primary">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account on Educated Gamer Arena (&quot;Platform&quot;), you agree to be bound by these Terms and Conditions and all applicable local Pakistani regulations governing competitive digital sports.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Eligibility & Age Requirements</h2>
          <p>
            You must be at least 13 years of age to register an account. If you are under 18, you represent that you have received permission from a parent or legal guardian to participate in skill-based competitions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. Skill-Based Competition</h2>
          <p>
            Educated Gamer Arena hosts skill-based esports tournaments and player challenges in Garena Free Fire. Outcomes depend entirely on the relative in-game mechanical skill, tactical strategy, and coordination of the participants.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Prohibited Activities</h2>
          <p>
            Users are strictly prohibited from using cheats, unauthorized scripts, modded game clients, or colluding with opponents to fix match results. Violations will result in immediate account termination.
          </p>
        </section>
      </div>
    </div>
  );
}
