import { useState } from 'react'
import { Check, Crown } from 'lucide-react'
import { useSubscription } from '../hooks/useSubscription'
import { postJson } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const FREE_FEATURES = [
  'Access to core prep modules',
  'Basic question tracking',
  'Daily plan',
]

const PREMIUM_FEATURES = [
  'Advanced analytics dashboard',
  'Mock interview mode',
  'Smart revision queue',
  'Priority feature access',
]

export default function PricingPage() {
  const { token } = useAuth()
  const { plan, refresh } = useSubscription()
  const [showCheckout, setShowCheckout] = useState(false)
  const [paying, setPaying] = useState(false)
  const [message, setMessage] = useState('')

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  return (
    <div className="relative space-y-4">
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-56 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.35),transparent_65%)]" />
      <div className="pointer-events-none absolute right-0 top-24 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <h2 className="text-2xl font-semibold text-white">Pricing</h2>
      <section className="rounded-2xl border border-indigo-300/25 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 p-5 shadow-[0_0_40px_rgba(99,102,241,0.18)]">
        <h3 className="text-base font-semibold text-white">Why we charge for Premium</h3>
        <p className="mt-2 text-sm text-indigo-100/90">
          Premium helps us maintain servers, run analytics pipelines, improve AI-driven recommendation quality,
          and continuously add new interview-focused content. The free plan stays available for everyone, while
          Premium supports the advanced experiences below.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="rounded-lg border border-indigo-300/30 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-100">
            Advanced analytics and trend insights
          </p>
          <p className="rounded-lg border border-violet-300/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-100">
            Mock interview simulation with timing and scoring
          </p>
          <p className="rounded-lg border border-fuchsia-300/30 bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-100">
            Smart revision queue with spaced repetition
          </p>
          <p className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
            Faster feature updates and premium roadmap access
          </p>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 p-5">
          <h3 className="text-lg font-semibold text-white">Basic (Free)</h3>
          <p className="mt-1 text-sm text-neutral-400">Best for getting started.</p>
          <p className="mt-3 text-2xl font-bold text-white">₹0<span className="text-sm text-neutral-500">/month</span></p>
          <ul className="mt-4 space-y-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                <Check className="size-4 text-emerald-300" />
                {f}
              </li>
            ))}
          </ul>
        </section>
        <section className="relative overflow-hidden rounded-2xl border border-indigo-400/50 bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-fuchsia-500/15 p-5 shadow-[0_0_50px_rgba(129,140,248,0.25)]">
          <div className="absolute right-3 top-3 rounded-full border border-amber-300/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
            Most Popular
          </div>
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-amber-300" />
            <h3 className="text-lg font-semibold text-white">Premium</h3>
          </div>
          <p className="mt-1 text-sm text-neutral-400">Designed for serious interview prep.</p>
          <p className="mt-3 text-2xl font-bold text-white">₹99<span className="text-sm text-neutral-500">/month</span></p>
          <ul className="mt-4 space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-200">
                <Check className="size-4 text-emerald-300" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            {plan === 'premium' ? (
              <p className="text-sm text-emerald-200">You are on Premium plan.</p>
            ) : (
              <button
                type="button"
                onClick={() => setShowCheckout(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
              >
                Proceed to Payment (₹99)
              </button>
            )}
          </div>
        </section>
      </div>
      {showCheckout && plan !== 'premium' ? (
        <section className="rounded-2xl border border-indigo-400/30 bg-neutral-950/80 p-5">
          <h3 className="text-base font-semibold text-white">Premium Checkout</h3>
          <p className="mt-1 text-sm text-neutral-400">
            Amount payable: ₹99 / month. You will be redirected to secure Razorpay checkout.
          </p>
          {message ? <p className="mt-3 text-xs text-emerald-200">{message}</p> : null}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={paying}
              onClick={async () => {
                setPaying(true)
                try {
                  if (!token) throw new Error('Please log in first')
                  const scriptLoaded = await loadRazorpayScript()
                  if (!scriptLoaded) throw new Error('Failed to load payment gateway')
                  const order = await postJson('/api/subscription/create-order', {}, { token })
                  if (order?.alreadyPremium) {
                    setMessage('You are already on Premium plan.')
                    return
                  }
                  const options = {
                    key: order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'PrepFlow',
                    description: order.description || 'Premium subscription',
                    order_id: order.orderId,
                    handler: async (response) => {
                      await postJson('/api/subscription/verify-payment', response, { token })
                      await refresh()
                      setMessage('Payment successful. Premium activated.')
                    },
                    prefill: {
                      name: order.customer?.name || '',
                      email: order.customer?.email || '',
                    },
                    theme: { color: '#6366f1' },
                  }
                  const rzp = new window.Razorpay(options)
                  rzp.open()
                } finally {
                  setPaying(false)
                }
              }}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {paying ? 'Opening payment...' : 'Pay ₹99 securely'}
            </button>
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}
