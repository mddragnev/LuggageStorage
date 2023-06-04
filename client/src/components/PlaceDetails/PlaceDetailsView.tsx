import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PlaceDetailsForm from "./PlaceDetailsForm";
import classes from "./PlaceDetailsView.module.scss";

const PlaceDetailsView = () => {
  const {
    state,
  }: { state: { address: any; workingHours: any; opened: boolean } } =
    useLocation();

  const navigate = useNavigate();
  const navigateToReservation = (reservationInfo: any) => {
    // navigate("/reservation", { state: { asd: "asd" } });
    navigate("/reservation", {
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

  return (
    <section className={classes.view}>
      <div className={classes.view__information__container}>
        <div className={classes.view__information__title}>
          <div>{state.address.type}</div>
          <div>
            <h3>{state.address.storeName}</h3>
          </div>
          <div>{state.opened ? "Отворено" : "Затворено"}</div>
        </div>
        <div className={classes.view__information__workingTime}></div>
      </div>
      <div className={classes.view__form}>
        <PlaceDetailsForm
          workingHours={state.workingHours}
          navigate={navigateToReservation}
        />
      </div>
    </section>
  );
};

export default PlaceDetailsView;
