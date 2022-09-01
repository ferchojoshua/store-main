import React, { useContext } from "react";
import { Typography, Stack } from "@mui/material";
import { DataContext } from "../../context/DataContext";

let tema = false;

export const PrintReport = React.forwardRef((props, ref) => {
  const { title } = useContext(DataContext);

  return (
    <div ref={ref} style={{ padding: 20 }}>
      <Stack justifyContent={"space-between"} direction="row">
        <img
          loading="lazy"
          src={require("../media/Icono.png")}
          alt="logo"
          style={{ height: 50 }}
        />
        <Stack display="flex" justifyContent="center">
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 11,
            }}
          >{`${title} - Chinandega`}</Typography>
          <Typography
            sx={{
              color: "#2196f3",
              textAlign: "center",
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            {props.titulo}
          </Typography>
          <span style={{ textAlign: "center", fontSize: 10 }}>
            {props.fecha}
          </span>
        </Stack>

        <img
          loading="lazy"
          src={require("../media/Icono.png")}
          alt="logo"
          style={{ height: 50 }}
        />
      </Stack>
      <div style={{ fontSize: 10 }}>{props.children}</div>
    </div>
  );
});
