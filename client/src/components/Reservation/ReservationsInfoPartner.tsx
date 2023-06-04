import React from "react";
import useAuth from "../../hooks/useAuth";
import classes from "./ReservationsInfoPartner.module.scss";
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

const ReservationsInfoPartner = () => {
  const { auth }: any = useAuth();
  const privateAxios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery(
    ["partnerReservations"],
    async () => {
      try {
        const result = await privateAxios.get("/partner/reservations", {
          params: { partnerId: auth.id },
        });
        return result.data || [];
      } catch (err) {
        console.log(err);
      }
    }
  );

  const validateMutation = useMutation(
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
        console.log("updated");
        queryClient.setQueryData(["partnerReservations"], (old: any) => {
          const newUsers = [...old].filter((x) => x._id !== reservation._id);
          const newData = [...newUsers, reservation];
          return newData;
        });
        //   queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const approveReservation = (data: any) => {
    data.reservationDetails = {
      ...data.reservationDetails,
      status: "approved",
    };
    validateMutation.mutate(data);
  };

  return isLoading ? (
    <div>Loading</div>
  ) : data.length === 0 ? (
    <div className={classes.reservations__container}>Нямате резервации</div>
  ) : (
    <div className={classes.reservations__container}>
      {data.map((reservation: any) => (
        <Accordion sx={{ width: "100%" }} key={reservation._id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ width: "70%", flexShrink: 0 }}>
              Нова резервация от{" "}
              {`${reservation.userInfo.firstName} ${reservation.userInfo.lastName}`}
            </Typography>
            <Typography
              sx={{ color: "text.secondary", textAlign: "end", width: "30%" }}
            >
               {reservation.reservationDetails.status === "requested"
                ? "Заявена"
                : reservation.reservationDetails.status === "approved"
                ? "Удобрена" 
                : reservation.reservationDetails.status === "canceled" ? "Отказана" : "Завършена"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.reservationsInfoPartner__CTA}>
              <Typography>
                Резервация за {reservation.reservationDetails.luggageSize}{" "}
                багажа в периода{" "}
                {new Date(
                  reservation.reservationDetails.fromDate
                ).toLocaleDateString("en-GB")}{" "}
                -{" "}
                {new Date(
                  reservation.reservationDetails.toDate
                ).toLocaleDateString("en-GB")}
              </Typography>
              {reservation.reservationDetails.status === "requested" && (
                <Button onClick={() => approveReservation(reservation)}>
                  Удобри
                </Button>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ReservationsInfoPartner;
