import React from "react";
import { Divider, Container, Typography, Button } from "@mui/material";
import noEncontrado from "../media/animations/noEncontrado.json";
import Lottie from "react-lottie";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: noEncontrado,
  };

  let navigate = useNavigate();

  return (
    <div>
      <Container>
        <Typography variant="h4">Ruta no Encontrada</Typography>
        <Divider />
        <Lottie options={defaultOptions} style={{ width: 500 }} />

        <p style={{ color: "#03a9f4" }}>No encontramos lo que buscas!</p>
        <p style={{ color: "#03a9f4" }}>Comunicate con Sistemas</p>

        <Button
          onClick={() => {
            navigate(-1);
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

export default NotFound;
