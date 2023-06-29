import React, { useState, useContext } from "react";

import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { isEmpty, size } from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSave } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../context/DataContext";
import { changePasswordAsync, getToken, getUser } from "../services/Account";
import { simpleMessage, toastError } from "../helpers/Helpers";

const SetNewPasswordComponent = () => {
  const { setIsLoading, setIsDefaultPass } = useContext(DataContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasword, setNewPasword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = getToken();
  const user = getUser();

  const validateData = () => {
    let isValid = true;

    if (isEmpty(currentPassword)) {
      simpleMessage("error", "No ha ingresado su contraseña actual");
      return (isValid = false);
    }

    if (isEmpty(newPasword)) {
      simpleMessage("error", "No ha ingresado su nueva contraseña");
      return (isValid = false);
    }
    if (size(newPasword) < 6) {
      simpleMessage(
        "error",
        "la nueva contraseña debe ser mayor de 6 caracteres"
      );
      return (isValid = false);
    }
    if (isEmpty(passwordConfirm)) {
      simpleMessage("error", "No ha confirmado su contraseña nueva");
      return (isValid = false);
    }
    if (newPasword !== passwordConfirm) {
      simpleMessage("error", "Las contraseñas no son iguales");
      return (isValid = false);
    }
    return isValid;
  };

  const cambiarPass = async () => {
    if (validateData()) {
      setIsLoading(true);
      const data = {
        oldPassword: currentPassword,
        newPassword: newPasword,
        token,
      };
      const result = await changePasswordAsync(token, data);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsDefaultPass(false);
      setIsLoading(false);
      simpleMessage("Se cambio la contraseña", "success");
    }
  };
  return (
    <div>
      <Container style={{ width: 800 }}>
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div>
              <h1 style={{ color: "#ff5722" }}>Cambiar contraseña</h1>
              <h4 style={{ color: "#2196f3" }}>{user}</h4>
            </div>
          </div>
          <hr />
          <TextField
            variant="standard"
            fullWidth
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ marginTop: 20 }}
            value={currentPassword}
            label={"Contraseña actual"}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="toggle password visivility"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "#3f51b5" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ color: "#3f51b5" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            variant="standard"
            fullWidth
            onChange={(e) => setNewPasword(e.target.value)}
            style={{ marginTop: 20 }}
            value={newPasword}
            type={showPassword ? "text" : "password"}
            label={"Contraseña nueva"}
            placeholder={"Ingrese nueva contraseña"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="toggle password visivility"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "#3f51b5" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ color: "#3f51b5" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            variant="standard"
            fullWidth
            onChange={(e) => setPasswordConfirm(e.target.value)}
            style={{ marginTop: 20 }}
            value={passwordConfirm}
            label={"Confirme su contraseña"}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="toggle password visivility"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "#3f51b5" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ color: "#3f51b5" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={
              <FontAwesomeIcon icon={faSave} style={{ marginRight: 20 }} />
            }
            fullWidth
            onClick={() => cambiarPass()}
            style={{
              marginTop: 30,
              borderRadius: 20,
              color: "#4caf50",
              borderColor: "#4caf50",
            }}
            size="large"
          >
            Cambiar contraseña
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default SetNewPasswordComponent;
