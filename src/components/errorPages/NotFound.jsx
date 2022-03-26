import React from "react";
import { Divider, Container, Typography } from "@mui/material";
import noEncontrado from "../media/animations/noEncontrado.json";
import Lottie from "react-lottie";

const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: noEncontrado,
  };
  return (
    <div>
      <Container>
        <Typography variant="h4">Ruta no Encontrada</Typography>
        <Divider />
        <Lottie options={defaultOptions} style={{ width: 500 }} />
      </Container>
    </div>
  );
};

export default NotFound;
