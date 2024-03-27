import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe'; // Ensure you import Stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1OyyHtBEkzmgVjPEtQVfwOSh',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        automatic_tax: {enabled: true},
      });
      res.redirect(303, session.url);
    } catch (err) {
        const stripeError = err as Stripe.StripeRawError; // Assert err to be of type Stripe.StripeRawError // Assert err to be of type Stripe.StripeError
      res.status(stripeError.statusCode || 500).json(stripeError.message);
    }
 } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
 }
}