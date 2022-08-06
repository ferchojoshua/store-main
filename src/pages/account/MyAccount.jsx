import React, { useContext, useState } from "react";

import {
  Paper,
  Avatar,
  Grid,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { DataContext } from "../../context/DataContext";

import moment from "moment";
import "moment/locale/es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import UpdateData from "./UpdateData";
import Loading from "../../components/Loading";
import SmallModal from "../../components/modals/SmallModal";
import ChangePass from "./ChangePass";
moment.locale("es");

const MyAccount = () => {
  const { user } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);

  const changePass = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Container>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Mi cuenta</h1>
        </div>

        <hr />

        <Grid container spacing={10}>
          <Grid item sm={12} md={4}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
              }}
            >
              <Paper
                elevation={20}
                style={{
                  paddingTop: 30,
                  paddingLeft: 30,
                  paddingRight: 30,
                  borderRadius: 30,
                }}
              >
                <Grid align="center">
                  <Avatar
                    sx={{ width: 120, height: 120, bgcolor: "#9c27b0" }}
                    style={{ marginTop: 50 }}
                    src={require("../../components/media/Icono.png")}
                  />
                  <Typography
                    style={{
                      marginTop: 20,
                      color: "#2196f3",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {` Usuario: ${user}`}
                  </Typography>
                  <Typography
                    style={{
                      marginTop: 10,
                      color: "#357a38",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {` Fecha: ${moment(user.fecha).format("LL")}`}
                  </Typography>
                </Grid>
                <div style={{ display: "flex", marginTop: 20 }}></div>
                <Button
                  style={{
                    borderRadius: 20,
                    marginTop: 20,
                    marginBottom: 50,
                    color: "#ff9100",
                    borderColor: "#ff9100",
                  }}
                  variant="outlined"
                  fullWidth
                  startIcon={<FontAwesomeIcon icon={faSync} />}
                  onClick={() => changePass()}
                >
                  Cambiar Contraseña
                </Button>
              </Paper>
            </Paper>
          </Grid>

          <Grid item sm={12} md={8}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
              }}
            >
              <UpdateData />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Loading />

      <SmallModal
        isVisible={showModal}
        setVisible={setShowModal}
        titulo="Cambiar Contraseña"
      >
        <ChangePass setShowModal={setShowModal} />
      </SmallModal>
    </div>
  );
};

export default MyAccount;
