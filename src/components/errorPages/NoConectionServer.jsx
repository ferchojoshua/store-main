import React from "react";
import { Divider, Container, Typography, Button } from "@mui/material";
import noServer from "../media/animations/noServer.json";
import Lottie from "react-lottie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const NoConectionServer = () => {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: noServer,
  };

  let navigate = useNavigate();

  return (
    <div>
      <Container>
        <Typography variant="h4">Sin Coneccion</Typography>
        <Divider />
        <Lottie options={defaultOptions} style={{ width: 500 }} />
        <p style={{ color: "#03a9f4" }}>Servidor no Encontrado!</p>
        <p style={{ color: "#03a9f4" }}>Comunicate con Sistemas</p>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          style={{ marginRight: 20, borderRadius: 20 }}
          variant="outlined"
        >
          <FontAwesomeIcon
            style={{ marginRight: 10, fontSize: 20 }}
            icon={faCircleArrowLeft}
          />
          Regresar
        </Button>
      </Container>
    </div>
  );
};
