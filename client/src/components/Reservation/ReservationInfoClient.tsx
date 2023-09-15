import React from "react";
import classes from "./ReservationInfoClient.module.scss";
import useAuth from "../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const ReservationInfoClient = () => {
  const navigate = useNavigate();
  const { auth }: any = useAuth();
  const privateAxios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery(
    ["clientReservations"],
    async () => {
      try {
        const result = await privateAxios.get("/client/reservations", {
          params: { clientId: auth.id },
        });
        return result.data || [];
      } catch (err) {
        console.log(err);
      }
    }
  );

  const finishMutation = useMutation(
    async (data: any) => {
      try {
        const result = await privateAxios.put("/reservation", {
          reservation: data,
        });
        return result.data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: (reservation: any) => {
        queryClient.setQueryData(["clientReservations"], (old: any) => {
          const newReservations = [...old].filter(
            (x) => x._id !== reservation._id
          );
          const oldReservation = old.find(
            (x: any) => x._id === reservation._id
          );
          const newData = [
            ...newReservations,
            {
              ...reservation,
              address: oldReservation.address,
              workingHours: oldReservation.workingHours,
            },
          ];
          return newData;
        });
        //   queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://google.com/maps?q=${lat},${lng}`);
  };

  const finishReservation = (data: any) => {
    const reserv = {
      _id: data._id,
      shopId: data.shopId,
      userInfo: data.userInfo,
      reservationDetails: { ...data.reservationDetails, status: "finished" },
    };
    finishMutation.mutate(reserv);
  };

  const cancelReservation = (data: any) => {
    const reserv = {
      _id: data._id,
      shopId: data.shopId,
      userInfo: data.userInfo,
      reservationDetails: { ...data.reservationDetails, status: "canceled" },
    };
    finishMutation.mutate(reserv);
  };

  const navigateToPlace = (reservation: any) => {
    navigate("/location", {
      state: {
        address: reservation.address,
        workingHours: reservation.workingHours,
        opened: true,
      },
    });
  };

  return isLoading ? (
    <div>Loading</div>
  ) : data.length === 0 ? (
    <div className={classes.reservations__client__container}>
      Нямате резервации
    </div>
  ) : (
    <div className={classes.reservations__client__container}>
      {data.map((reservation: any) => (
        <Accordion sx={{ width: "100%" }} key={reservation._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: "70%", flexShrink: 0 }}>
              Вашата резервация в {reservation.address.storeName}
            </Typography>
            <Typography
              sx={{ color: "text.secondary", textAlign: "end", width: "30%" }}
            >
              {reservation.reservationDetails.status === "requested"
                ? "Заявена"
                : reservation.reservationDetails.status === "approved"
                ? "Одобрена"
                : reservation.reservationDetails.status === "canceled"
                ? "Отказана"
                : "Завършена"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.reservationsInfoPartner__CTA}>
              <Typography>
                Резервация за {reservation.reservationDetails.luggageSize}{" "}
                багажа на стойност {reservation.reservationDetails.totalPrice}
                лв. в периода{" "}
                {new Date(
                  reservation.reservationDetails.fromDate
                ).toLocaleDateString("en-GB")}{" "}
                -{" "}
                {new Date(
                  reservation.reservationDetails.toDate
                ).toLocaleDateString("en-GB")}
              </Typography>
              <Typography>
                Обект от тип {reservation.address.type} на адрес{" "}
                {reservation.address.address}, {reservation.address.city},{" "}
                {reservation.address.country}
              </Typography>
              <Typography>
                Упътване: {reservation.address.directions}
              </Typography>
              <div className={classes.reservation__workingTime}>
                Работното време на обекта е:
                <div>
                  {Object.keys(reservation.workingHours)
                    .filter((x) => x !== "info")
                    .map((day: string, idx: number) => (
                      <div
                        key={day}
                        className={classes.reservation__workingTime__hours}
                      >
                        <div>{reservation.workingHours[day].label}</div>
                        <div>{reservation.workingHours[day].hours.open}</div>
                        <div>{reservation.workingHours[day].hours.closing}</div>
                      </div>
                    ))}
                </div>
              </div>
              {reservation.reservationDetails.status === "requested" ? (
                <div className={classes.reservation__actions}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      openDirections(
                        reservation.address.lat,
                        reservation.address.lng
                      )
                    }
                  >
                    Вземи адрес
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => cancelReservation(reservation)}
                  >
                    Откажи резервация
                  </Button>
                </div>
              ) : reservation.reservationDetails.status === "approved" ? (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => finishReservation(reservation)}
                >
                  Завърши
                </Button>
              ) : (
                <Button
                  sx={{ margin: "1rem 0" }}
                  fullWidth
                  variant="contained"
                  onClick={() => navigateToPlace(reservation)}
                >
                  Запази обекта отново
                </Button>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ReservationInfoClient;
