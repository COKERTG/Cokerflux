import React from 'react';

export default function FAQ() {
  return (
    <section className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            1. How do I place an order?
          </h2>
          <p>
            Browse our shop, add items to your cart, and proceed to checkout.
            You’ll receive a confirmation email with order details.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            2. What payment methods are accepted?
          </h2>
          <p>
            We accept major credit cards (Visa, MasterCard, Amex) and PayPal.
            All transactions are processed securely via Stripe.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            3. Do you ship internationally?
          </h2>
          <p>
            Yes! Shipping rates are calculated at checkout. International
            customers may be subject to customs fees, which are the
            responsibility of the recipient.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            4. How can I track my order?
          </h2>
          <p>
            Once your order ships, you’ll receive a tracking number via email.
            Use it on the carrier’s website to monitor delivery status.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            5. What is your return policy?
          </h2>
          <p>
            We accept returns within 30 days of receipt for unused items.
            Contact support for a return authorization and instructions.
          </p>
        </div>
      </div>
    </section>
  );
}
