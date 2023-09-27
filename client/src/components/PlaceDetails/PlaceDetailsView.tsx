import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PlaceDetailsForm from "./PlaceDetailsForm";
import classes from "./PlaceDetailsView.module.scss";
import { DefaultStyles } from "../Map/MapStyles";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import ShopCard from "../Shops/ShopCard";

const PlaceDetailsView = () => {
  const {
    state,
  }: { state: { address: any; workingHours: any; opened: boolean } } =
    useLocation();

  const navigate = useNavigate();
  const navigateToReservation = (reservationInfo: any) => {
    // navigate("/reservation", { state: { asd: "asd" } });
    navigate("/payment", {
      state: {
        address: state.address,
        workingHours: state.workingHours,
        reservation: { ...reservationInfo },
      },
    });
    // navigate("/reservation", {
    //   state: {
    //     address: "фдсафсд",
    //   },
    // });
  };

  const onLoad = (map: any) => {
    const marker = new google.maps.Marker({
      position: { lat: state.address.lat, lng: state.address.lng },
      map,
      label: {
        text: "\uf235",
        fontFamily: "Material Icons",
        color: "#ffffff",
        fontSize: "18px",
      },
    });
  };

  return (
    <section className={classes.view}>
      <div className={classes.view__information__container}>
        <div className={classes.mini__map}>
          <GoogleMap
            zoom={16}
            center={{ lat: state.address.lat, lng: state.address.lng }}
            mapContainerClassName={classes.map__container}
            options={{
              styles: DefaultStyles,
              disableDefaultUI: true,
              gestureHandling: "none",
            }}
            onLoad={onLoad}
          ></GoogleMap>
        </div>
        <div className={classes.view__information__title}>
          <ShopCard shop={state}></ShopCard>
        </div>
        <div className={classes.view__information__workingTime}>
          <div className={classes.reservation__workingTime}>
            Работното време на обекта е:
            <div>
              {Object.keys(state.workingHours)
                .filter((x) => x !== "info")
                .map((day: string, idx: number) => (
                  <div
                    key={day}
                    className={classes.reservation__workingTime__hours}
                  >
                    {state.workingHours[day].working ? 
                    <>
                    <div>{state.workingHours[day].label}</div>
                    <div>{state.workingHours[day].hours.open}</div>
                    <div>{state.workingHours[day].hours.closing}</div> 
                    </> : <>
                    <div>{state.workingHours[day].label}</div>
                    <div>Затворено</div>
                    </>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.view__form}>
        <PlaceDetailsForm
          store={state.address}
          workingHours={state.workingHours}
          navigate={navigateToReservation}
        />
      </div>
    </section>
  );
};

export default PlaceDetailsView;
