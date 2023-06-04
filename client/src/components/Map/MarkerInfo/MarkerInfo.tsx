import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

const MarkerInfo = ({
  address,
  workingHours,
  handleNavigationToDetails,
}: any) => {
  const isClosed = () => {
    const todayDate = new Date();
    const today = todayDate.toLocaleDateString(undefined, { weekday: "long" });
    const hours = todayDate.getHours();
    const minutes = todayDate.getMinutes();
    const workingTime = workingHours[today.toLowerCase()].hours;
    const open = workingTime.open.split(":");
    const closing = workingTime.closing.split(":");
    const fullTime = open[0] === closing[0] && open[1] === closing[1];
    if (fullTime) {
      return true;
    }
    const opened =
      workingHours[today.toLowerCase()].working &&
      ((+open[0] <= hours && +open[1] <= minutes && +closing[0] > hours) ||
        (+closing[0] === hours && +closing[1] >= minutes));
    return opened;
  };

  const navigateToDetails = () => {
    handleNavigationToDetails(address, workingHours, isClosed());
  };

  return (
    <Card sx={{ maxWidth: 345, boxShadow: "none" }}>
      <CardHeader
        title={address.storeName}
        subheader={`5 лв. за 24 часа на багаж | ${address.type}`}
        subheaderTypographyProps={{ variant: "subtitle2" }}
      />
      <Divider light />
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Работно време</div>
          <div>
            <Typography variant="body2" color="text.secondary">
              {isClosed() ? "Отворено" : "Затворено"}
            </Typography>
          </div>
        </div>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button variant="contained" fullWidth onClick={navigateToDetails}>
          Виж детайли
        </Button>
      </CardActions>
    </Card>
  );
};

export default MarkerInfo;
