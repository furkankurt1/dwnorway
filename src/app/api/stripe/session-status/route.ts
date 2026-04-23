import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  try {
    const sessionId = new URL(req.url).searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Payment unavailable" }, { status: 503 });
    }

    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error("Stripe session-status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
