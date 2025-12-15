import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Stripe from "stripe";
import { db } from "../drizzle/db";
import { incrementPlayerCoins } from "../services/game";
import { STRIPE_KEY, STRIPE_WEBHOOK_SECRET } from "../constants/constants";
dotenv.config();

const stripe = new Stripe(STRIPE_KEY);

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { packageId } = req.body;
    const userId = req.user?.userId;

    if (!packageId || !userId) {
      res.status(400);
      throw new Error("Unable to create checkout session");
    }

    const selectedPackage = await db.query.CoinPackagesTable.findFirst({
      where: (coinPackages, { eq }) => eq(coinPackages.packageId, packageId),
      columns: {
        amount: true,
        price: true,
      },
    });

    if (!selectedPackage) {
      res.status(400);
      throw new Error("Unable to create checkout session");
    }

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
        success_url: "http://localhost:3000/payment-success",
        cancel_url: "http://localhost:3000/payment-canceled",
        metadata: {
          userId,
          chips: selectedPackage.amount,
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
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
      res.status(400);
      throw new Error(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const amount = session.metadata?.chips;
        const chargeId = session.payment_intent as string | undefined;

        try {
          if (!userId || !chargeId || !amount) {
            res.status(400);
            throw new Error("Missing required metadata");
          }

          await incrementPlayerCoins(userId, Number(amount));

          res.status(200).json({
            error: false,
            message: "Successfully updated user chips balance",
          });

          return;
        } catch (err) {
          res.status(400);
          throw new Error("Could not update user chips balance");
        }

        break;

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  }
);
