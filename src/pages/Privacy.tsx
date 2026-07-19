import TopNav from '../components/layout/TopNav'
import Footer from '../components/layout/Footer'

export default function Privacy() {
  return (
    <div className="bg-bg min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 px-4 sm:px-6 lg:px-14 py-12 max-w-2xl mx-auto w-full">
        <div className="font-display font-extrabold text-3xl text-white">Privacy Policy</div>
        <div className="text-white/40 text-sm mt-2">Last updated: {new Date().toLocaleDateString('en-US')}</div>
        <div className="text-white/60 text-sm leading-relaxed mt-8 flex flex-col gap-5">
          <p>
            We collect the information you give us when you create an account (email), the photos you
            upload for generation, and basic usage data needed to run the service (like credit balance
            and generation history).
          </p>
          <p>
            Uploaded photos and generated results are processed by our AI provider (fal.ai)
            solely to create your requested content, and are stored temporarily so you can download your
            results before they expire.
          </p>
          <p>
            Payment details are handled entirely by Stripe — we never see or store your card information.
          </p>
          <p>
            We don't sell your personal data. We only share it with the service providers strictly needed
            to operate FlexCheck (hosting, AI generation, payments).
          </p>
          <p>
            You can request deletion of your account and associated data at any time by contacting us at
            contact@flexcheck.app.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
