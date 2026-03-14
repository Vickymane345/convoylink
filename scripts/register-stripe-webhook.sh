#!/usr/bin/env bash
# ─── Register ConvoyLink Stripe Webhook ───────────────────────────────────────
# Usage: STRIPE_SECRET_KEY=sk_live_... DEPLOY_URL=https://convoylink.com bash scripts/register-stripe-webhook.sh
#
# Requires Stripe CLI: https://stripe.com/docs/stripe-cli
# Or use the Stripe Dashboard: Dashboard > Developers > Webhooks > Add endpoint

set -e

DEPLOY_URL="${DEPLOY_URL:?Set DEPLOY_URL to your production URL, e.g. https://convoylink.com}"
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:?Set STRIPE_SECRET_KEY}"

WEBHOOK_URL="${DEPLOY_URL}/api/webhooks/stripe"

echo "Registering webhook at: $WEBHOOK_URL"

stripe webhooks create \
  --url "$WEBHOOK_URL" \
  --events \
    checkout.session.completed,\
    checkout.session.expired,\
    payment_intent.payment_failed,\
    charge.refunded \
  --api-key "$STRIPE_SECRET_KEY"

echo ""
echo "✅ Webhook registered. Copy the 'whsec_...' signing secret and add it to your"
echo "   Vercel environment variables as STRIPE_WEBHOOK_SECRET."
