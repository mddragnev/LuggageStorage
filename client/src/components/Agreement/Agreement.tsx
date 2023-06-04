import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import React from "react";

const Agreement = ({ prevStep, nextStep }: any) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <h2>Съгласие за партньорство</h2>
        <div>
          Желая да бъда регистриран в платформата за краткосрочно складиране на
          багаж. Съгласявам се със следните правила и условия:
        </div>
        <div>
          1. <b>Всеки багаж ще се съхранява сигурно в магазина.</b> Вие или друг
          работник ще потвърди резервацията на клиента, ще сложи етикет и ще
          съхранява сигурно докато клиентът се върне.
        </div>
        <div>
          С продължаването напред се съгласявам с правилата и условията на
          компанията.
        </div>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button color="inherit" onClick={prevStep} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />

          <Button onClick={() => nextStep({ info: "register" })}>Next</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Agreement;
