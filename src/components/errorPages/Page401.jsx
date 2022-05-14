import React from "react";
import { Divider, Container, Typography, Button } from "@mui/material";
import noAutorizado from "../media/animations/noAutorizado.json";
import Lottie from "react-lottie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Page401 = () => {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: noAutorizado,
  };

  let navigate = useNavigate();

  return (
    <div>
      <Container>
        <Typography variant="h4">Usuario no autorizado</Typography>
        <Divider />
        <Lottie options={defaultOptions} style={{ width: 500 }} />
        <p style={{ color: "#03a9f4" }}>No estas autorizado!</p>
        <p style={{ color: "#03a9f4" }}>Comunicate con Sistemas</p>
        <Button
          onClick={() => {
            navigate(-2);
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

export default Page401;
