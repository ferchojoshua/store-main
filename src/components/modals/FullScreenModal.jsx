import React, { useRef } from "react";
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
import { PrintReport } from "./PrintReport";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = ({ titulo, children, handleClose, open, fecha }) => {
  const compRef = useRef();
  const { title } = useContext(DataContext);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
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
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handleClose()}
              aria-label="close"
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ color: "#ff9800" }}
              />
            </IconButton>
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
            {titulo}
          </Typography>
          <span style={{ textAlign: "center" }}>{fecha}</span>

          <ReactToPrint
            trigger={() => {
              return (
                <IconButton
                  variant="outlined"
                  style={{ position: "fixed", right: 50, top: 75 }}
                >
                  <PrintRoundedIcon
                    style={{ fontSize: 50, color: "#2979ff", width: 50 }}
                  />
                </IconButton>
              );
            }}
            content={() => compRef.current}
          />
        </Stack>

        <DialogContent>{children}</DialogContent>
        <div
          style={{
            display: "none",
          }}
        >
          <PrintReport ref={compRef} fecha={fecha} titulo={titulo}>
            {children}
          </PrintReport>
        </div>
      </Dialog>
    </div>
  );
};

export default FullScreenModal;
