import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@mui/material";

const PaymentForm = ({ onCompletion }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleError = (msg: string) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect: "if_required",
    });
    if (error) {
      console.log(error);
      handleError(error.message || "");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onCompletion();
    } else {
      handleError("Unexpected state");
    }

    setIsProcessing(false);
  };
  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit} style={{ width: "100%" }}>
        <PaymentElement />
        <Button
          fullWidth
          sx={{marginTop: "1rem"}}
          variant="contained"
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? "Обработка ..." : "Плати"}
        </Button>
      </form>
      <ToastContainer />
    </>
  );
};

export default PaymentForm;
