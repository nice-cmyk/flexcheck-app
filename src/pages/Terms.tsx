import TopNav from '../components/layout/TopNav'
import Footer from '../components/layout/Footer'

export default function Terms() {
  return (
    <div className="bg-bg min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 px-4 sm:px-6 lg:px-14 py-12 max-w-2xl mx-auto w-full">
        <div className="font-display font-extrabold text-3xl text-white">Terms of Service</div>
        <div className="text-white/40 text-sm mt-2">Last updated: {new Date().toLocaleDateString('en-US')}</div>
        <div className="text-white/60 text-sm leading-relaxed mt-8 flex flex-col gap-5">
          <p>
            By using FlexCheck, you agree to these terms. FlexCheck lets you transform photos into
            AI-generated lifestyle images and videos using the credits attached to your account.
          </p>
          <p>
            You must own the rights to any photo you upload and confirm it depicts you or someone who
            has given you permission. You're responsible for how you use the generated content, and you
            agree not to use the service to create misleading, illegal, or harmful content.
          </p>
          <p>
            Subscriptions and credit packs are billed through Stripe. Subscriptions renew automatically
            unless cancelled before the renewal date. Credit packs never expire; subscription credits
            reset each billing cycle.
          </p>
          <p>
            Generated files are available for download for a limited time after creation. We recommend
            saving anything you want to keep.
          </p>
          <p>
            We may update these terms from time to time. Continued use of the app after a change means
            you accept the updated terms. Questions? Reach us at contact@flexcheck.app.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
