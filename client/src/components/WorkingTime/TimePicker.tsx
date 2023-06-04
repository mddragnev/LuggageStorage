import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";

import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import TimeSelect from "./TimeSelect";
const TimePicker = ({ day, handleSave, displayDay, incomingState }: any) => {
  const [fromHours, setFromHours] = useState(incomingState.hours.open);
  const [toHours, setToHours] = useState(incomingState.hours.closing);

  const [checked, setChecked] = useState(incomingState.working);

  const onSwitchChange = (val: any) => {
    handleSave((prev: any) => {
      const d = prev[day];
      d.working = val;
      return { ...prev };
    });
    setChecked(val);
  };

  const onOpeningHoursChange = (val: any) => {
    handleSave((prev: any) => {
      const d = prev[day];
      d.hours.open = val;
      return { ...prev };
    });
    setFromHours(val);
  };

  const onClosingHoursChange = (val: any) => {
    handleSave((prev: any) => {
      const d = prev[day];
      d.hours.closing = val;
      return { ...prev };
    });
    setToHours(val);
  };

  return (
    <Card sx={{ minWidth: 275, width: "100%" }}>
      <CardContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={(event) => onSwitchChange(event.target.checked)}
              />
            }
            label={displayDay}
          />
          <Grid container spacing={2} wrap="nowrap" alignItems="center">
            <Grid item xs={12} sm={6}>
              <TimeSelect val={fromHours} saveTime={onOpeningHoursChange} />
            </Grid>
            <Grid item>
              <Typography component="h1" variant="h6">
                до
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimeSelect val={toHours} saveTime={onClosingHoursChange} />
            </Grid>
          </Grid>
        </FormGroup>
      </CardContent>
    </Card>
  );
};

export default TimePicker;
