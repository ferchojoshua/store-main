import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataContext } from "../../context/DataContext";
import { isEmpty, trim } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { simpleMessage } from "../../helpers/Helpers";
import {
  getToken,
  getUserAsync,
  updateMyAccountAsync,
} from "../../services/Account";


const UpdateData = () => {
  const { user, setIsLoading, reload, setReload } = useContext(DataContext);

  const token = getToken();
  const [userData, setUserData] = useState([]);

  const [firstName, setfirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondlastName, setSecondLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getUserAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
        return;
      }
      setIsLoading(false);

      setUserData(result.data);

      setfirstName(result.data.firstName);
      setSecondName(result.data.secondName);
      setPhone(result.data.phoneNumber);

      setLastName(result.data.lastName);
      setSecondLastName(result.data.secondLastName);
      setAddress(result.data.address);
    })();
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

  const setData = () => {
    const data = {
      id: userData.id,
      firstName: trim(firstName),
      secondName: trim(secondName),
      lastName: trim(lastName),
      secondlastName: trim(secondlastName),
      phoneNumber: trim(phone),
      address: trim(address),
    };
    return data;
  };

  const execute = async () => {
    setIsLoading(true);
    const data = setData();
    const result = await updateMyAccountAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      simpleMessage(result.error, "error");
      return;
    }
    setUserData(result.data);
    setReload(!reload);
    setIsLoading(false);
    setReload(!reload);
  };

  const setNewFirstName = async () => {
    if (isEmpty(firstName)) {
      simpleMessage("No ha ingresado un nombre", "error");
      return;
    }
    await execute();
    simpleMessage("Nombre actualizado", "success");
  };

  const setNewSecondName = async () => {
    if (isEmpty(secondName)) {
      simpleMessage("No ha ingresado el segundo nombre", "error");
      return;
    }
    await execute();
    simpleMessage("Segundo nombre actualizado", "success");
  };

  const setNewLastName = async () => {
    if (isEmpty(lastName)) {
      simpleMessage("No ha ingresado un apellido", "error");
      return;
    }
    await execute();
    simpleMessage("Apellido actualizado", "success");
  };

  const setNewSecondLastName = async () => {
    if (isEmpty(secondlastName)) {
      simpleMessage("No ha ingresado el segundo apellido", "error");
      return;
    }
    await execute();
    if (isEmpty(secondName)) {
      simpleMessage("No ha ingresado el segundo nombre", "error");
      return;
    }
    await execute();
    simpleMessage("Segundo nombre actualizado", "success");
  };

  const setNewAddress = async () => {
    if (isEmpty(address)) {
      simpleMessage("No ha ingresado la direccion", "error");
      return;
    }
    await execute();
    simpleMessage("Direccion actualizada", "success");
  };

  const setNewPhoneNumber = async () => {
    if (isEmpty(phone)) {
      simpleMessage("No ha ingresado un numero telefonico", "error");
      return;
    }
    await execute();
    simpleMessage("Numero telefonico actualizado", "success");
  };

  return (
    <Paper elevation={20} style={{ padding: 30, borderRadius: 30 }}>
      <Grid align="center">
        <Typography
          variant="h5"
          style={{
            marginTop: 50,
            color: "#ff9100",
            fontWeight: 800,
          }}
        >
          {` Editar datos: ${user}`}
        </Typography>
        <Grid container style={{ marginTop: 30, marginBottom: 30 }}>
          <Grid item sm={6} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setfirstName(e.target.value)}
              value={firstName}
              label={"Primer nombre"}
              placeholder={"Ingrese primer nombre"}
              InputLabelProps={{
                shrink: firstName ? true : false,
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginRight: 10 }}
                      onClick={() => setNewFirstName()}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#105155" }}
                        icon={faPaperPlane}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setSecondName(e.target.value)}
              value={secondName}
              label={"Segundo nombre"}
              placeholder={"Ingrese segundo nombre"}
              style={{ marginTop: 30 }}
              InputLabelProps={{
                shrink: secondName ? true : false,
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginRight: 10 }}
                      onClick={() => setNewSecondName()}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#105155" }}
                        icon={faPaperPlane}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              label={"Numero telefonico"}
              placeholder={"Ingrese numero telefonico"}
              style={{ marginTop: 30 }}
              InputLabelProps={{
                shrink: phone ? true : false,
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginRight: 10 }}
                      onClick={() => setNewPhoneNumber()}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#105155" }}
                        icon={faPaperPlane}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item sm={6} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              label={"Primer apellido"}
              placeholder={"Ingrese primer apellido"}
              inputProps={{ style: { textTransform: "capitalize" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginRight: 10 }}
                      onClick={() => setNewLastName()}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#105155" }}
                        icon={faPaperPlane}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setSecondLastName(e.target.value)}
              value={secondlastName}
              label={"Segundo apellido"}
              placeholder={"Ingrese segundo apellido"}
              style={{ marginTop: 30 }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginRight: 10 }}
                      onClick={() => setNewSecondLastName()}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#105155" }}
                        icon={faPaperPlane}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              label={"Direccion"}
              placeholder={"Ingrese direccion"}
              style={{ marginTop: 30 }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginRight: 10 }}
                      onClick={() => setNewAddress()}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#105155" }}
                        icon={faPaperPlane}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UpdateData;
