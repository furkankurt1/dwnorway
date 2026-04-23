import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Donation completed:", {
        id: session.id,
        amount: session.amount_total,
        currency: session.currency,
        email: session.customer_details?.email,
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.warn("Payment failed:", intent.id, intent.last_payment_error?.message);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
