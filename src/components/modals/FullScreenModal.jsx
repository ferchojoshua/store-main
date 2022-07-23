import * as React from "react";
import { Dialog, DialogContent } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Slide from "@mui/material/Slide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faGlobeAmericas,
} from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../context/DataContext";
import { useContext } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = ({ titulo, children, setOpen, open }) => {
  const { title } = useContext(DataContext);
  const handleClose = () => {
    setOpen(false);
  };
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
        <Typography
          sx={{
            textAlign: "center",
            marginTop: 3,
          }}
          variant="h5"
          component="div"
        >
          {titulo}
        </Typography>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
};

export default FullScreenModal;
