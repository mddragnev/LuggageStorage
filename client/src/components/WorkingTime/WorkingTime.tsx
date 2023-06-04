import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useState } from "react";
import TimePicker from "./TimePicker";

const WorkingTime = ({ nextStep, prevStep, upcommingState }: any) => {
  const [state, setState] = useState(() => {
    return {
      monday: upcommingState?.monday || {
        working: true,
        label: "Понеделник",
        hours: { open: "09:00", closing: "19:00" },
      },
      tuesday: upcommingState?.tuesday || {
        working: true,
        label: "Вторник",

        hours: { open: "09:00", closing: "19:00" },
      },
      wednesday: upcommingState?.wednesday || {
        working: true,
        label: "Сряда",

        hours: { open: "09:00", closing: "19:00" },
      },
      thursday: upcommingState?.thursday || {
        working: true,
        label: "Четвъртък",

        hours: { open: "09:00", closing: "19:00" },
      },
      friday: upcommingState?.friday || {
        label: "Петък",

        working: true,
        hours: { open: "09:00", closing: "19:00" },
      },
      saturday: upcommingState?.saturday || {
        label: "Събота",

        working: true,
        hours: { open: "09:00", closing: "19:00" },
      },
      sunday: upcommingState?.sunday || {
        working: true,
        label: "Неделя",

        hours: { open: "09:00", closing: "19:00" },
      },
    };
  });
  const handleSubmit = () => {
    const data = state;
    const result = {
      info: "hours",
      ...data,
    };
    nextStep(result);
  };
  const handlePrevStep = () => {
    const data = state;
    const result = {
      info: "hours",
      ...data,
    };
    prevStep(result);
  };

  return (
    <Container component="main">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TimePicker
          day="monday"
          handleSave={setState}
          displayDay={state.monday.label}
          incomingState={state.monday}
        />
        <TimePicker
          day="tuesday"
          handleSave={setState}
          displayDay={state.tuesday.label}
          incomingState={state.tuesday}
        />
        <TimePicker
          day="wednesday"
          handleSave={setState}
          displayDay={state.wednesday.label}
          incomingState={state.wednesday}
        />
        <TimePicker
          day="thursday"
          handleSave={setState}
          displayDay={state.thursday.label}
          incomingState={state.thursday}
        />
        <TimePicker
          day="friday"
          handleSave={setState}
          displayDay={state.friday.label}
          incomingState={state.friday}
        />
        <TimePicker
          day="saturday"
          handleSave={setState}
          displayDay={state.saturday.label}
          incomingState={state.saturday}
        />
        <TimePicker
          day="sunday"
          handleSave={setState}
          displayDay={state.sunday.label}
          incomingState={state.sunday}
        />
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button color="inherit" onClick={handlePrevStep} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />

          <Button onClick={handleSubmit}>Next</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default WorkingTime;
