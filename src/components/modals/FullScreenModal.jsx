import React, { useContext } from "react";
import { Dialog, Stack, Divider, Container } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import Typography from "@mui/material/Typography";

import Slide from "@mui/material/Slide";

import { DataContext } from "../../context/DataContext";

import Lottie from "react-lottie";
import noAccess from "../media/animations/noAccess.json";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = () => {
  const {open = false,  title, serverAccess } = useContext(DataContext);

  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: noAccess,
  };

  return (
    <div>
      <Dialog fullScreen open={serverAccess} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <img
              loading="lazy"
              src={require("../media/Icono.png")}
              alt="logo"
              style={{ height: 40 }}
            />
            <Typography
              sx={{ ml: 2, flex: 1, textAlign: "center" }}
              variant="h4"
              component="div"
            >
              {`${title} - Chinandega`}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Stack display="flex" justifyContent="center">
            <Typography
              sx={{
                color: "#2196f3",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 2,
              }}
              variant="h5"
              component="div"
            >
              Servidor Fuera de Acceso
            </Typography>
            <Divider />

            <Lottie options={defaultOptions} style={{ width: 1200 }} />

            <Typography
              variant="h6"
              textAlign={"center"}
              style={{ color: "#03a9f4" }}
            >
              Estas Fuera de Horas Habiles!
            </Typography>
            <Typography
              variant="h6"
              textAlign={"center"}
              style={{ color: "#03a9f4" }}
            >
              Comunicate con Sistemas!
            </Typography>
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
};

export default FullScreenModal;
