import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const generateWorkingTimes = () => {
  const result = [];
  for (let i = 0; i <= 9; i++) {
    result.push(`0${i}:00`);
  }
  for (let i = 10; i <= 19; i++) {
    result.push(`${i}:00`);
  }
  for (let i = 20; i <= 24; i++) {
    result.push(`${i}:00`);
  }
  return result;
};

const WORKING_TIME = generateWorkingTimes();

const TimeSelect = ({ val, saveTime }: any) => {
  const [hours, setHours] = React.useState(val);

  const handleChangeHours = (hour: any) => {
    setHours(hour);
    saveTime(hour);
  };

  return (
    <>
      <Select
        id="simple-select"
        value={hours}
        fullWidth
        MenuProps={MenuProps}
        onChange={(event) => handleChangeHours(event.target.value as string)}
      >
        {WORKING_TIME.map((w, idx) => (
          <MenuItem key={idx} value={w}>
            {w}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default TimeSelect;
