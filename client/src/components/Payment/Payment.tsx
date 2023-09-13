import React, { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import classes from "./Payment.module.scss";
import { Button } from "@mui/material";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const privateAxios = useAxiosPrivate();
  const { state }: any = useLocation();
  const navigate = useNavigate();

  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  const getConfig = async (controller: any) => {
    let result;
    try {
      result = await privateAxios.get("/payment/config", {
        signal: controller.signal,
      });
      setStripePromise(loadStripe(result.data.publishableKey));
    } catch (err) {
      console.log(err);
    }

    return result;
  };

  const createPaymentIntent = async (controller: any) => {
    let result;
    try {
      result = await privateAxios.post(
        "/payment/intent",
        { amount: state.reservation.totalPrice },
        {
          signal: controller.signal,
        }
      );
      setClientSecret(result.data.clientSecret);
    } catch (err) {
      console.log(err);
    }

    return result;
  };

  const navigateOnCompletion = () => {
    navigate("/reservation", {
      state: {
        ...state,
      },
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    getConfig(controller);
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    createPaymentIntent(controller);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <section className={classes.form__container}>
            <PaymentForm onCompletion={navigateOnCompletion} />
          </section>
        </Elements>
      )}
    </>
  );
};

export default Payment;
