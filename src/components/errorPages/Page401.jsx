import React from "react";
import { Divider, Container, Typography } from "@mui/material";
import noAutorizado from "../media/animations/noAutorizado.json";
import Lottie from "react-lottie";

const Page401 = () => {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: noAutorizado,
  };
  return (
    <div>
      <Container>
        <Typography variant="h4">Usuario no autorizado</Typography>
        <Divider />
        <Lottie options={defaultOptions} style={{ width: 500 }} />
      </Container>
    </div>
  );
};

export default Page401;
