import React, { useContext } from "react";
import { Typography, Stack } from "@mui/material";
import { DataContext } from "../../context/DataContext";


export const PrintReport = React.forwardRef((props, ref) => {
  const { title } = useContext(DataContext);

  const getPageMargins = () => {
    return `body
    {
      margin: 0mm 10mm 0mm 10mm;
      padding-top:15mm;
      padding-bottom:15mm;
    }
   #table-to-xls{
    width:100%;
   }
   .w-100{
    width:100% !important;
   }
   @media screen, print {
    table {width: 100%}
    .w-100{
      width:100% !important;
     }
.css-spazkk-MuiContainer-root {
    max-width: 100% !important;
    width: 100% !important;
}
}
    `;
  };

  return (
    <div ref={ref}>
      <style>{getPageMargins()}</style>
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