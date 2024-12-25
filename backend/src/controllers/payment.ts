import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Stripe from "stripe";
import query from "../db";
dotenv.config();

const STRIPE_KEY = process.env.STRIPE_KEY ? process.env.STRIPE_KEY : "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  ? process.env.STRIPE_WEBHOOK_SECRET
  : "";

const stripe = new Stripe(STRIPE_KEY);

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { packageId } = req.body;

    if (!packageId) {
      res.status(400);
      throw new Error("Package id missing");
    }

    let q = "SELECT `amount`, `price` FROM coin_packages WHERE `packageId` = ?";

    let data: any = await query(q, [packageId]);

    if (data.length === 0) {
      res.status(400);
      throw new Error(`Coin package with id ${packageId} not found`);
    }

    const selectedPackage = data[0];

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${selectedPackage.amount} Coins`,
              },
              unit_amount: selectedPackage.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-canceled",
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500);
      throw new Error("Unable to create checkout session");
    }
  }
);

export const handleWebHook = asyncHandler((req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    console.log("Event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout Session Completed:", session);
    }

    res.status(200).json("Webhook received");
  } catch (error: any) {
    console.error("err", error);
    res.status(400);
    throw new Error(`Webhook Error: ${error.message}`);
  }
});
