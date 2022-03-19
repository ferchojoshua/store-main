import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  CssBaseline,
  Grid,
  Paper,
  Box,
  Avatar,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";

import background from "../components/media/img1Encab.png";
import { createTokenAsync } from "../services/Account";
import { simpleMessage } from "../helpers/Helpers";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {`Copyright © Auto&Moto ${new Date().getFullYear()}.`}
    </Typography>
  );
}

const Login = () => {
  let navigate = useNavigate();
  // const [movimientosList, setmovimientosList] = useState([]);
  const { setIsLoading, setIsLogged } = useContext(DataContext);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      username: user,
      password,
      rememberMe: true,
    };
    const result = await createTokenAsync(data);
    if (!result.statusResponse) {
      setIsLoading(false);
      simpleMessage("Usuario o contraseña incorrecto", "error");
      return;
    }

    actionLog();
    setIsLoading(false);
    navigate("/");
  };

  const actionLog = () => {
    setIsLogged(true);
  };

  return (
    <div>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", width: 70, height: 70 }}
            >
              <FontAwesomeIcon style={{ fontSize: 40 }} icon={faUserLock} />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar sesion
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Divider
                variant="middle"
                style={{ marginTop: 20, marginBottom: 20 }}
              />
              <TextField
                margin="normal"
                variant="standard"
                required
                fullWidth
                value={user}
                label="Usuario"
                autoComplete="user"
                autoFocus
                onChange={(e) => setUser(e.target.value)}
              />
              <TextField
                margin="normal"
                variant="standard"
                required
                value={password}
                fullWidth
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 4, mb: 2, borderRadius: 20, p: 1 }}
              >
                Iniciar Sesion
              </Button>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
