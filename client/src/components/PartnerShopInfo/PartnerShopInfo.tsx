import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import WorkingTime from "../WorkingTime/WorkingTime";
import { Button, TextField } from "@mui/material";
import classes from "./PartnerShopInfo.module.scss";

function PartnerShopInfo(props: any) {
  const { auth }: any = useAuth();
  const privateAxios = useAxiosPrivate();
  const [price, setPrice] = useState(0);
  const { data = [], isLoading } = useQuery(["partnerStores"], async () => {
    try {
      const result = await privateAxios.get(`/places/${auth.id}`);
      setPrice(result.data[0].address.price);
      return result.data[0] || {};
    } catch (err) {
      console.log(err);
    }
  });

  const saveMutation = useMutation(
    async (data: any) => {
      try {
        const result = await privateAxios.put("/places", {
          shop: data,
        });
        return result.data;
      } catch (err) {
        console.log(err);
      }
    }
  );

  const saveChanges = () => {
    const updatedPlace = {
        ...data
    };
    updatedPlace.address.price = price;
    saveMutation.mutate(updatedPlace);
    
  };

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div className={classes.partnerShopInfoContainer}>
      <h2>Информация за обект {data.address.storeName}</h2>
      <TextField
        sx={{ width: "50%", marginTop: "2rem" }}
        margin="normal"
        type="number"
        name="priceChooser"
        label="Цена за единица багаж на ден в лева"
        id="priceChooser"
        value={price}
        onChange={(e: any) => setPrice(e.target.value)}
      />
      <WorkingTime upcommingState={data.workingHours}></WorkingTime>
      <Button onClick={saveChanges}>Запази промените</Button>
    </div>
  );
}

export default PartnerShopInfo;
