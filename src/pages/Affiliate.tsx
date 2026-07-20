import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gift, Copy, Check } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { getReferralCode, getReferralLink, listMyReferrals, referralStats, Referral } from '../lib/referrals'
import { formatCredits } from '../lib/credits'

export default function Affiliate() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [code, setCode] = useState<string | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([getReferralCode(user.id), listMyReferrals(user.id)]).then(([c, refs]) => {
      setCode(c)
      setReferrals(refs)
      setLoading(false)
    })
  }, [user])

  const stats = referralStats(referrals)
  const link = code ? getReferralLink(code) : ''

  async function copyLink() {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppLayout>
      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
            <Gift size={20} className="text-primary-light" />
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl text-white">{t('affiliate.title')}</div>
            <div className="text-white/50 text-sm mt-0.5">
              {t('affiliate.subtitle')}
            </div>
          </div>
        </div>

        <div className="bg-surface/80 border border-primary/20 rounded-2xl p-5 mt-7">
          <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">{t('affiliate.yourLink')}</div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 bg-bg border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm truncate">
              {loading ? '...' : link}
            </div>
            <button
              onClick={copyLink}
              disabled={!link}
              className="flex-none w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white disabled:opacity-50"
              aria-label="Copy link"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <div className="text-white/40 text-xs mt-3">
            {t('affiliate.everyFriend', { n: formatCredits(1) })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
          <StatCard label={t('affiliate.invited')} value={String(stats.invited)} />
          <StatCard label={t('affiliate.converted')} value={String(stats.rewardedCount)} />
          <StatCard label={t('affiliate.creditsEarned')} value={formatCredits(stats.creditsEarned)} />
        </div>

        <div className="text-white font-semibold text-base mt-8">{t('affiliate.yourReferrals')}</div>
        <div className="flex flex-col gap-2.5 mt-3">
          {loading && <div className="text-white/40 text-sm">{t('common.loading')}</div>}
          {!loading && referrals.length === 0 && (
            <div className="text-white/40 text-sm">
              {t('affiliate.noOneYet')}
            </div>
          )}
          {referrals.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between bg-surface/60 border border-white/10 rounded-xl px-4 py-3"
            >
              <div>
                <div className="text-white text-sm">{r.referred_email ?? t('affiliate.user')}</div>
                <div className="text-white/40 text-xs mt-0.5">
                  {new Date(r.created_at).toLocaleDateString('en-US')}
                </div>
              </div>
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  r.status === 'rewarded' ? 'bg-success/15 text-success' : 'bg-white/10 text-white/50'
                }`}
              >
                {r.status === 'rewarded' ? `+${formatCredits(r.reward_credits)} ${t('common.credit')}` : t('affiliate.pending')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface/60 border border-white/10 rounded-xl p-2.5 sm:p-4 text-center">
      <div className="font-display font-bold text-xl sm:text-2xl text-white">{value}</div>
      <div className="text-white/40 text-[10px] sm:text-xs mt-1">{label}</div>
    </div>
  )
}
