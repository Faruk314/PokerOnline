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
    const userId = req.user?.userId;

    if (!packageId) {
      res.status(400);
      throw new Error("Package id missing in create checkout session");
    }

    if (!userId) {
      res.status(400);
      throw new Error("UserId missing in create checkout session");
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
        metadata: {
          userId,
          chips: selectedPackage.amount,
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500);
      throw new Error("Unable to create checkout session");
    }
  }
);

export const handleWebHook = asyncHandler(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error: any) {
      console.error("err", error);
      res.status(400);
      throw new Error(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const chips = session.metadata?.chips;

        try {
          const q = `
          INSERT INTO user_chips (userId, chips)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE chips = chips + VALUES(chips);
        `;

          await query(q, [userId, chips]);

          res.status(200).json("Successfully updated user chips balance");
        } catch (err) {
          res.status(400);
          throw new Error(
            "There was a problem while updating user chips balance"
          );
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  }
);
