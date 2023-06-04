import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import classes from "./Reservation.module.scss";

const Reservation = () => {
  const { state }: any = useLocation();
  const { auth }: any = useAuth();
  const privateAxios = useAxiosPrivate();
  console.log(state);
  const openDirections = () => {
    window.open(
      `https://google.com/maps?q=${state.address.lat},${state.address.lng}`
    );
  };
  const createReservation = async (reservation: any, controller: any) => {
    let result;
    try {
      result = await privateAxios.post(
        "/reservation",
        { reservation },
        { signal: controller.signal }
      );
    } catch (err) {
      console.log(err);
    }

    return result;
  };

  useEffect(() => {
    const controller = new AbortController();
    const reservation = {
      userId: auth?.id,
      shopId: state.address.id,
      totalPrice: state.reservation.totalPrice,
      fromDate: state.reservation.fromDate,
      toDate: state.reservation.toDate,
      luggageSize: state.reservation.luggageSize,
      status: "requested",
    };
    const result = createReservation(reservation, controller);
    console.log(result);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className={classes.reservation__container}>
      <div className={classes.reservation__title}>
        <h3>Благодарим ви, че направихте резервация!</h3>
      </div>
      <div className={classes.reservation__subtitle}>
        <h4>Информация за резервацията</h4>
      </div>
      <div className={classes.reservation__information}>
        <div className={classes.reservation__dates}>
          <div>
            Вие запазихте {state.reservation.luggageSize} места за багаж на
            стойност {state.reservation.totalPrice}лв.
          </div>
          <div>
            Вашата резервация е в периода{" "}
            {state.reservation.fromDate.toLocaleDateString("en-GB")} -{" "}
            {state.reservation.toDate.toLocaleDateString("en-GB")}
          </div>
        </div>
        <div className={classes.reservation__workingTime}>
          Работното време на обекта е:
          <div>
            {Object.keys(state.workingHours)
              .filter((x) => x !== "info")
              .map((day: string, idx: number) => (
                <div key={day} className={classes.reservation__workingTime__hours}>
                  <div>{state.workingHours[day].label}</div>
                  <div>{state.workingHours[day].hours.open}</div>
                  <div>{state.workingHours[day].hours.closing}</div>
                </div>
              ))}
          </div>
        </div>
        <div className={classes.reservation__address}>
          <div className={classes.reservation__address__title}>
            Информация за обект {state.address.storeName}
          </div>
          <div className={classes.reservation__address__fullAddress}>
            Обект от тип {state.address.type} на адрес {state.address.address},{" "}
            {state.address.city}, {state.address.country}
          </div>
          <div className={classes.reservation__address_directions}>
            Упътване: {state.address.directions}
          </div>
          <Button fullWidth variant="contained" onClick={openDirections}>
            Вземи адрес
          </Button>
          
        </div>
      </div>
    </section>
  );
};

export default Reservation;
