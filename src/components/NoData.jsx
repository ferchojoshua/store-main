import React from "react";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";

const NoData = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography style={{ color: "#ff5722", marginBottom: 20 }} variant="h6">
        No hay Registros 
      </Typography>
      <FontAwesomeIcon
        style={{ color: "#ff5722", fontSize: 100 }}
        icon={faDatabase}
      />
    </div>
  );
};

export default NoData;
