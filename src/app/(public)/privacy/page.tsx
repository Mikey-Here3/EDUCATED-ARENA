export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-4">Privacy Policy</h1>
      <p className="text-xs text-text-muted mb-8">Last updated: September 2026</p>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed bg-bg-card p-8 rounded-2xl border border-border-primary">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Information We Collect</h2>
          <p>
            We collect personal information necessary to deliver competitive esports services: email address, username, phone number, date of birth, and Free Fire In-Game UID.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Financial Privacy</h2>
          <p>
            Payment reference details, deposit receipts, withdrawal accounts (Easypaisa/JazzCash), and ledger balances are strictly private. They are never exposed publicly or shared with opponents.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. Public Data Exposure</h2>
          <p>
            Only safe public gamer profile information (username, display name, avatar, win/loss stats, ELO rating, and match history) is displayed to other platform users.
          </p>
        </section>
      </div>
    </div>
  );
}
