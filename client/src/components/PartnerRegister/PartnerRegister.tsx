import Box from "@mui/material/Box";

import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { registerPartner } from "../../services/auth";
import AddressForm from "../AdressForm/AdressForm";
import Agreement from "../Agreement/Agreement";
import RegisterPartnerForm from "../RegisterPartnerForm/RegisterPartnerForm";
import WorkingTime from "../WorkingTime/WorkingTime";
const PartnerRegister = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [addressInfo, setAddressInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [hoursInfo, setHoursInfo] = useState({});

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

  const handleNext = async (data: any) => {
    if (data?.info === "address") {
      setAddressInfo(data);
    } else if (data?.info === "contact") {
      setContactInfo(data);
    } else if (data?.info === "hours") {
      setHoursInfo(data);
    } else if (data?.info === "register") {
      try {
        await registerPartner(
          addressInfo,
          { ...contactInfo, role: "partner" },
          hoursInfo
        );
      } catch (err: any) {
        if (!err?.response) {
          handleError("Възникна проблем със сървъра.");
        } else if (err.response?.status === 409) {
          handleError("Потребител с такъв имейл вече съществува.");
        } else {
          handleError("Регистрацията не е успешна.");
        }
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (data: any) => {
    if (data?.info === "contact") {
      setContactInfo(data);
    } else if (data?.info === "hours") {
      setHoursInfo(data);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const steps = [
    {
      label: "Адрес",
      component: (
        <AddressForm
          prevStep={handleBack}
          nextStep={handleNext}
          upcommingState={addressInfo}
        />
      ),
    },
    {
      label: "Профил",
      component: (
        <RegisterPartnerForm
          prevStep={handleBack}
          nextStep={handleNext}
          upcommingState={contactInfo}
        />
      ),
    },
    {
      label: "Работно време",
      component: (
        <WorkingTime
          prevStep={handleBack}
          nextStep={handleNext}
          upcommingState={hoursInfo}
        />
      ),
    },
    {
      label: "Съгласие",
      component: <Agreement prevStep={handleBack} nextStep={handleNext} />,
    },
  ];

  return (
    <>
      <Box sx={{ width: { xs: "100%", sm: "50%" }, margin: "2rem auto" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={step.label} {...stepProps}>
                <StepLabel {...labelProps}>{step.label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ mt: 2, mb: 1 }}>
                Благодарим ви за регистрацията, ще получите имейл когато тя е
                потвърдена.
              </Typography>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>{steps[activeStep].component}</React.Fragment>
        )}
      </Box>
      <ToastContainer />
    </>
  );
};
export default PartnerRegister;
