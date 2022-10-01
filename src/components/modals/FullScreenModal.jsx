import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, Stack } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Slide from "@mui/material/Slide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../context/DataContext";
import { useContext } from "react";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReactToPrint from "react-to-print";
import moment from "moment/moment";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = () => {
  const { title } = useContext(DataContext);

  return (
    <div>
      <Dialog
        fullScreen
        open={true}
        // TransitionComponent={Transition}
      >
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
            {/* <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowModal(false)}
              aria-label="close"
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ color: "#ff9800" }}
              />
            </IconButton> */}
          </Toolbar>
        </AppBar>

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
            Servidor Durmiendo
          </Typography>
          {/* <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "L"
          )} - Hasta: ${moment(hasta).format("L")}`}</span> */}
        </Stack>

        {/* <DialogContent>{children}</DialogContent> */}
        {/* <div
          style={{
            display: "none",
          }}
        >
          <PrintReport ref={compRef} fecha={fecha} titulo={titulo}>
            {children}
          </PrintReport>
        </div> */}
      </Dialog>
    </div>
  );
};

export default FullScreenModal;
