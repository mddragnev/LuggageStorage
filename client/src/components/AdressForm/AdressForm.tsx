import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";

const AddressForm = ({ nextStep, prevStep, upcommingState }: any) => {
  const [errorState, setErrorState] = useState({
    storeName: false,
    country: false,
    city: false,
    address: false,
    zip: false,
    directions: false,
    type: false,
    storageLimit: false,
  });
  const [state, setState] = useState(() => {
    return {
      storeName: upcommingState?.storeName || "",
      country: upcommingState?.country || "",
      city: upcommingState?.city || "",
      address: upcommingState?.address || "",
      zip: upcommingState?.zip || "",
      directions: upcommingState?.directions || "",
      type: upcommingState?.type || "",
      storageLimit: upcommingState?.storageLimit || 0,
      price: upcommingState?.price || 5,
    };
  });
  const handleSubmit = async () => {
    const data = state;
    const fullAddress = `${data.address}, ${data.city}, ${data.country}`;
    const addressResult = await getGeocode({ address: fullAddress });
    const loc = addressResult[0].address_components.find((c) =>
      c.types.includes("locality")
    )?.long_name;
    const { lat, lng } = await getLatLng(addressResult[0]);
    const result = {
      info: "address",
      storeName: data.storeName,
      country: data.country,
      city: data.city,
      address: data.address,
      zip: data.zip,
      directions: data.directions,
      type: data.type,
      storageLimit: +data.storageLimit,
      price: +data.price,
      lat,
      lng,
      locality: loc,
    };
    nextStep(result);
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
        <Box
          component="form"
          noValidate
          onSubmit={(event) => console.log(event)}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            error={!state?.storeName && errorState.storeName}
            required
            fullWidth
            id="storeName"
            label="Име на магазина"
            name="storeName"
            autoFocus
            value={state?.storeName}
            onChange={(e) => {
              setState({ ...state, storeName: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, storeName: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, storeName: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            error={!state?.country && errorState.country}
            fullWidth
            name="country"
            label="Държава"
            id="country"
            value={state?.country}
            onChange={(e) => {
              setState({ ...state, country: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, country: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, country: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            error={!state?.city && errorState.city}
            fullWidth
            name="city"
            label="Град"
            id="city"
            value={state?.city}
            onChange={(e) => {
              setState({ ...state, city: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, city: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, city: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            error={!state?.address && errorState.address}
            fullWidth
            name="address"
            label="Адрес"
            id="address"
            value={state?.address}
            onChange={(e) => {
              setState({ ...state, address: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, address: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, address: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            error={!state?.zip && errorState.zip}
            fullWidth
            name="zip"
            label="Пощенски код"
            id="zip"
            value={state?.zip}
            onChange={(e) => {
              setState({ ...state, zip: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, zip: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, zip: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={!state?.directions && errorState.directions}
            name="directions"
            label="Упътване"
            id="directons"
            value={state?.directions}
            onChange={(e) => {
              setState({ ...state, directions: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, directions: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, directions: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={!state?.type && errorState.type}
            name="type"
            label="Вид на обекта"
            id="type"
            value={state?.type}
            onChange={(e) => {
              setState({ ...state, type: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, type: false, initial: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, type: true, initial: false };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            required
            error={!state?.storageLimit && errorState.storageLimit}
            fullWidth
            type="number"
            name="storageLimit"
            label="Максимално количество багаж за съхранение"
            id="storageLimit"
            value={state?.storageLimit}
            onChange={(e) => {
              setState({ ...state, storageLimit: e.target.value });
              if (e.target.value) {
                setErrorState((prevState): any => {
                  return { ...prevState, storageLimit: false };
                });
              } else {
                setErrorState((prevState): any => {
                  return { ...prevState, storageLimit: true };
                });
              }
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            type="number"
            name="priceChooser"
            label="Цена за единица багаж на ден в лева"
            id="priceChooser"
            value={state?.price}
            onChange={(e) => {
              setState({ ...state, price: e.target.value });
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={true}
            onClick={prevStep}
            sx={{ mr: 1 }}
          >
            Предишна стъпка
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />

          <Button
            type="submit"
            onClick={() => handleSubmit()}
            disabled={Object.values(state).filter((x) => !x).length !== 0}
          >
            Следваща стъпка
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddressForm;
