import { Autocomplete, TextField } from "@mui/material";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlacesAutocomplete, {
  getDetails,
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import classes from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ callbackName: "initMap" });

  const [selectValue, setSelectValue] = useState(null);
  const handleChange = async (event: any, address: any) => {
    if (address) {
      setValue(address.description ? address.description : address, false);
      setSelectValue(address);
      clearSuggestions();

      const results = await getGeocode({ address: address.description ? address.description : address });
      //use bounds and check if the lng lat of address are within the bounds (need to set it from addressForm)
      const { lat, lng } = await getLatLng(results[0]);
      const northEastBound = results[0].geometry.bounds?.getNorthEast();
      const southWestBound = results[0].geometry.bounds?.getSouthWest();
      navigate("/map", {
        state: {
          lat,
          lng,
          locality: {
            northEast: {lat: northEastBound?.lat(), lng: northEastBound?.lng()},
            southWest: {lat: southWestBound?.lat(), lng: southWestBound?.lng()}
          }
        },
      });
    } else {
      setValue("", false);
    }
  };

  return (
    <>
      <div className={classes.home}>
        <div className={classes.home__title}>
          <h1>Складиране на багаж на крачка от теб</h1>
        </div>
        <div className={classes.home__content}>
          <Autocomplete
            filterOptions={(x) => x}
            options={data}
            getOptionLabel={(option: any) => option.description ? option.description : option}
            isOptionEqualToValue={(option, value) =>
              option?.description === value.description
            }
            freeSolo
            onChange={handleChange}
            value={selectValue}
            inputValue={value}
            onInputChange={(e: any) => {
              if (e) {
                setValue(e?.target.value);
              } else {
                setValue("");
              }
            }}
            disabled={!ready}
            forcePopupIcon={false}
            noOptionsText="Моля въведете адрес"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Моля потърсете град"
                variant="standard"
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

Home.propTypes = {};

export default Home;
