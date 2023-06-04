import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { toast, ToastContainer } from "react-toastify";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { login } from "../../services/auth";

const Login = () => {
  const { setAuth }: any = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(location);
    const data = new FormData(event.currentTarget);
    try {
      const result = await login(data.get("email"), data.get("password"));

      const accessToken = result?.data?.accessToken;
      const role = result?.data?.role;
      setAuth({
        email: data.get("email"),
        role,
        accessToken,
        id: result?.data?.id,
      });
      const state = location?.state?.from?.state;
      navigate(from, { replace: true, state: state  });
    } catch (err: any) {
      if (!err?.response) {
        handleError("Има проблем със сървъра.");
      } else if (err.response.status === 400) {
        handleError("Липсва имейл или парола");
      } else if (err.response.status === 401) {
        handleError("Имейлът или паролата са грешни");
      } else {
        handleError("Влизането в системата не е успешно");
      }
    }
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Моля въведете данните си
        </Typography>
        <Box
          component="form"
          onSubmit={(event) => handleSubmit(event)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Имейл адрес"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Парола"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Вход
          </Button>
          <Grid container>
            <Grid item xs>
              <Link variant="body2">Забравена парола?</Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2" component={RouterLink}>
                {"Нямате акаунт? Създайте от тук!"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Login;
