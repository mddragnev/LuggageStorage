import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "../../services/axios";

const RegisterPartnerForm = ({ nextStep, prevStep, upcommingState }: any) => {
  const [errorState, setErrorState] = useState(() => {
    return {
      firstName: false,
      lastName: false,
      phone: false,
      email: false,
      password: false,
    };
  });
  const [state, setState] = useState(() => {
    return {
      firstName: upcommingState?.firstName || "",
      lastName: upcommingState?.lastName || "",
      phone: upcommingState?.phone || "",
      email: upcommingState?.email || "",
      password: upcommingState?.password || "",
    };
  });
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
  const handleSubmit = async () => {
    const data = state;
    const result = {
      info: "contact",
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await axios.get("/users/verify", {
        params: { email: result.email },
      });
      if (response.status === 200) {
        handleError("Такъв потребител вече съществува!");
        return;
      }
    } catch (err) {
      console.error(err);
    }
    nextStep(result);
  };

  const handlePrevStep = () => {
    const data = state;
    const result = {
      info: "contact",
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password: data.password,
    };
    prevStep(result);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Контактно лице
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                error={!state?.firstName && errorState.firstName}
                fullWidth
                id="firstName"
                label="Собствено име"
                autoFocus
                value={state.firstName}
                onChange={(e) => {
                  setState({ ...state, firstName: e.target.value });
                  if (e.target.value) {
                    setErrorState((prevState): any => {
                      return { ...prevState, firstName: false };
                    });
                  } else {
                    setErrorState((prevState): any => {
                      return { ...prevState, firstName: true };
                    });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                error={!state?.lastName && errorState.lastName}
                fullWidth
                id="lastName"
                label="Фамилия"
                name="lastName"
                autoComplete="family-name"
                value={state.lastName}
                onChange={(e) => {
                  setState({ ...state, lastName: e.target.value });
                  if (e.target.value) {
                    setErrorState((prevState): any => {
                      return { ...prevState, lastName: false };
                    });
                  } else {
                    setErrorState((prevState): any => {
                      return { ...prevState, lastName: true };
                    });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                error={!state?.phone && errorState.phone}
                fullWidth
                name="phone"
                label="Телефон"
                value={state.phone}
                id="phone"
                onChange={(e) => {
                  setState({ ...state, phone: e.target.value });
                  if (e.target.value) {
                    setErrorState((prevState): any => {
                      return { ...prevState, phone: false };
                    });
                  } else {
                    setErrorState((prevState): any => {
                      return { ...prevState, phone: true };
                    });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                error={!state?.email && errorState.email}
                fullWidth
                id="email"
                label="Имейл адрес"
                name="email"
                value={state.email}
                autoComplete="email"
                onChange={(e) => {
                  setState({ ...state, email: e.target.value });
                  if (e.target.value) {
                    setErrorState((prevState): any => {
                      return { ...prevState, email: false };
                    });
                  } else {
                    setErrorState((prevState): any => {
                      return { ...prevState, email: true };
                    });
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={!state?.password && errorState.password}
                name="password"
                label="Парола"
                type="password"
                value={state.password}
                id="password"
                autoComplete="new-password"
                onChange={(e) => {
                  setState({ ...state, password: e.target.value });
                  if (e.target.value) {
                    setErrorState((prevState): any => {
                      return { ...prevState, password: false };
                    });
                  } else {
                    setErrorState((prevState): any => {
                      return { ...prevState, password: true };
                    });
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" onClick={handlePrevStep} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button
              onClick={handleSubmit}
              disabled={Object.values(state).filter((x) => !x).length !== 0}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default RegisterPartnerForm;
