const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const API_URL = `/api/${process.env.API_VERSION}`;

router.get(`${API_URL}/payment/config`, (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post(`${API_URL}/payment/intent`, async (req, res) => {
  const amount = req.body.amount;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "bgn",
      amount: amount * 100,
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
});

module.exports = router;
