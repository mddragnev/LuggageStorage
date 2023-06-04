import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import classes from "./PlaceDetailsForm.module.scss";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceDetailsForm = ({ workingHours, navigate }: any) => {
  const pricePerBag = 5;
  const [luggageSize, setLuggageSize] = useState(2);
  const [fromDay, setFromDay] = useState(moment());
  const [toDay, setToDay] = useState(moment());

  const calculateTotalPrice = () => {
    return pricePerBag * luggageSize * (toDay.diff(fromDay, "days") + 1);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const reservationInfo = {
      luggageSize,
      fromDate: fromDay.toDate(),
      toDate: toDay.toDate(),
      totalPrice: calculateTotalPrice(),
    };
    navigate(reservationInfo);
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 8px",
        borderRadius: "1rem",
        padding: "2rem",
      }}
    >
      <div className={classes.counter__container}>
        <div className={classes.counter__container__info}>
          <div className={classes.counter__title}>
            Колко багаж жеалете да съхраните?
          </div>
          <div className={classes.counter__subtitle}>
            Куфар, раница или малки чанти
          </div>
        </div>
        <div className={classes.counter__element}>
          <IconButton
            disabled={luggageSize === 0}
            onClick={() => setLuggageSize((prev) => prev - 1)}
          >
            <RemoveIcon />
          </IconButton>
          <h3>{luggageSize}</h3>
          <IconButton onClick={() => setLuggageSize((prev) => prev + 1)}>
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <div className={classes.pickers__container}>
        <div>
          <div>
            {"Отворено от "}
            {workingHours[fromDay.format("dddd").toLowerCase()].hours.open}
            {" до "}
            {workingHours[fromDay.format("dddd").toLowerCase()].hours.closing}
          </div>
          <DatePicker
            views={["day"]}
            value={fromDay}
            onChange={(newValue: any) => setFromDay(newValue)}
          />
        </div>
        <div>
          <div>
            {"Отворено от "}
            {workingHours[toDay.format("dddd").toLowerCase()].hours.open}
            {" до "}
            {workingHours[toDay.format("dddd").toLowerCase()].hours.closing}
          </div>
          <DatePicker
            views={["day"]}
            value={toDay}
            onChange={(newValue: any) => setToDay(newValue)}
          />
        </div>
      </div>

      <div className={classes.price__container}>
        <div className={classes.price__label}>
          <h3>Детайли за цена</h3>
        </div>
        <div className={classes.price__info}>
          <span>
            {pricePerBag} лв. х {luggageSize} чанти x{" "}
            {toDay.diff(fromDay, "days") + 1} ден
          </span>
          <span>
            <b>{calculateTotalPrice()} лв.</b>
          </span>
        </div>
      </div>
      <Button type="submit" variant="contained" fullWidth>
        Запази
      </Button>
    </Box>
  );
};

export default PlaceDetailsForm;
