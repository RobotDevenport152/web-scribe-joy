# Stripe Webhook Setup Guide

This guide walks you through configuring Stripe webhooks to handle payment events for Pacific Alpacas.

## Prerequisites

- Active Stripe account with API keys
- Access to Supabase project dashboard
- Stripe CLI installed (for local testing)

## Step 1: Get Your Webhook Endpoint URL

Your Stripe webhook endpoint is hosted on Supabase Edge Functions:

```
https://<project-ref>.supabase.co/functions/v1/stripe-webhook
```

Replace `<project-ref>` with your actual Supabase project reference. You can find this in:
- Supabase Dashboard → Settings → General → Project URL

**Example:**
```
https://wuwrhqgpxnsgwrvtgpdr.supabase.co/functions/v1/stripe-webhook
```

## Step 2: Register Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Paste your webhook URL in the "Endpoint URL" field
5. Select the following events to listen for:
   - `payment_intent.succeeded` — when payment completes successfully
   - `payment_intent.payment_failed` — when payment fails

6. Click **Add endpoint** to save

## Step 3: Configure Webhook Secret in Supabase

After registering the endpoint, Stripe will display your **Signing secret** (starts with `whsec_`).

1. Copy the signing secret from Stripe
2. Go to Supabase Dashboard → Project Settings → Edge Functions
3. Create or update the `stripe-webhook` function environment variables:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (the signing secret from Stripe)

4. Redeploy the function if needed

**Note:** The webhook secret is used to verify that incoming requests actually come from Stripe and haven't been tampered with.

## Step 4: Test with Stripe CLI (Local Development)

To test webhooks locally during development:

```bash
# 1. Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# 2. Authenticate with your Stripe account
stripe login

# 3. Forward webhook events to your local development server
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# 4. In another terminal, trigger a test event
stripe trigger payment_intent.succeeded
```

The `--forward-to` flag tells Stripe CLI where to send webhook events. This is useful for:
- Testing webhook handling before deploying
- Verifying event structure and data
- Debugging payment flow issues

## Step 5: Monitor Webhook Deliveries

In Stripe Dashboard:

1. **Developers** → **Webhooks** → Select your endpoint
2. View **Recent deliveries** to see:
   - Event type and timestamp
   - HTTP response code (2xx = success)
   - Request/response body
   - Any error messages

3. Failed deliveries can be manually **Resent** from this view

## Webhook Events Handled

### `payment_intent.succeeded`
Triggered when a customer successfully completes payment. The webhook:
- Verifies the signature using `STRIPE_WEBHOOK_SECRET`
- Updates the order status in the database
- Triggers order fulfillment workflow

### `payment_intent.payment_failed`
Triggered when payment fails (declined card, etc.). The webhook:
- Updates order status to "failed"
- Notifies the customer via email
- Retains the order for retry attempts

## Troubleshooting

### Webhook not receiving events

**Check 1:** Verify endpoint URL is correct
```bash
curl -X POST https://your-endpoint-url.com/functions/v1/stripe-webhook
```

**Check 2:** Ensure `STRIPE_WEBHOOK_SECRET` is set in Supabase
- Go to Supabase → Project Settings → Edge Functions
- Look for the `stripe-webhook` function
- Verify the secret environment variable is configured

**Check 3:** Review Stripe Dashboard webhook logs
- **Developers** → **Webhooks** → Select endpoint
- Check "Recent deliveries" for error messages
- Look for HTTP 401/403 (auth issues) or 500 (server errors)

### Signature verification fails

If you see "Invalid signature" errors:
1. Confirm `STRIPE_WEBHOOK_SECRET` matches the webhook's signing secret (from Stripe)
2. Re-copy the secret from Stripe Dashboard (it may have been rotated)
3. Redeploy the function after updating the secret

## Security Best Practices

1. **Verify webhook signatures** — Always validate that incoming requests are from Stripe using the signing secret
2. **Use HTTPS** — Stripe only sends webhooks to HTTPS endpoints
3. **Don't rely on client-side events** — Always use webhooks for critical payment confirmations
4. **Handle idempotency** — Webhooks may be retried; ensure your handler is idempotent
5. **Keep secrets secure** — Never commit `STRIPE_WEBHOOK_SECRET` to version control

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe CLI Reference](https://stripe.com/docs/stripe-cli)
- [Payment Intent Documentation](https://stripe.com/docs/payments/payment-intents)
