import React from "react";
import { Button, Divider } from "@mui/material";
import classes from "./ShopCard.module.scss";

const ShopCard = ({ shop, handleNavigationToDetails }: any) => {
  const isClosed = () => {
    
    const todayDate = new Date();
    const today = todayDate.toLocaleDateString(undefined, { weekday: "long" });
    const hours = todayDate.getHours();
    const minutes = todayDate.getMinutes();
    const workingTime = shop.workingHours[today.toLowerCase()].hours;
    const open = workingTime.open.split(":");
    const closing = workingTime.closing.split(":");
    const fullTime = open[0] === closing[0] && open[1] === closing[1];
    if (!shop.workingHours[today.toLowerCase()].working) {
      return false;
    }
    if (fullTime) {
      return true;
    }
    const opened =
      shop.workingHours[today.toLowerCase()].working &&
      ((+open[0] <= hours && +open[1] <= minutes && +closing[0] > hours) ||
        (+closing[0] === hours && +closing[1] >= minutes));
    return opened;
  };
  const today = new Date()
    .toLocaleDateString(undefined, { weekday: "long" })
    .toLowerCase();
  return (
    <div className={classes.card__container}>
      <div>
        <span>{shop.address.type}</span>
      </div>
      <div>
        <h4>{shop.address.storeName}</h4>
      </div>
      <div>
        {isClosed()
          ? `Отворено от ${shop.workingHours[today].hours.open} до ${shop.workingHours[today].hours.closing}`
          : "Затворено"}{" "}
      </div>
      <Divider />
      <div className={classes.card__cta}>
        <div>{shop.address.price}лв. / 24 часа / чанта</div>
        {handleNavigationToDetails && (
          <Button
            onClick={() =>
              handleNavigationToDetails(
                { ...shop.address, id: shop._id },
                shop.workingHours,
                isClosed()
              )
            }
          >
            {" "}
            Виж детайли
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShopCard;
