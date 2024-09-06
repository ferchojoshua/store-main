import React, { useContext } from "react";
import { Typography, Stack } from "@mui/material";
import { DataContext } from "../../context/DataContext";

export const PrintReport = React.forwardRef((props, ref) => {
  const { title } = useContext(DataContext);

  // Función para aplicar estilos de margen y otros ajustes para la impresión
  const getPageMargins = () => {
    return `
      @page {
        margin: 10mm 5mm; /* Ajusta los márgenes de la página: superior/inferior 10mm, laterales 5mm */
      }
      body {
        margin: 0; /* Sin margen adicional en el body */
        padding: 10mm 0; /* Espacio superior e inferior para el contenido */
      }
      #table-to-xls {
        width: 100%;
      }
      .w-100 {
        width: 100% !important;
      }
      @media screen, print {
        table { width: 100%; }
        .w-100 {
          width: 100% !important;
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
      {/* Inserta los estilos dinámicos para los márgenes de impresión */}
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



// // import React, { useContext } from "react";
// // import { Typography, Stack } from "@mui/material";
// // import { DataContext } from "../../context/DataContext";


// // export const PrintReport = React.forwardRef((props, ref) => {
// //   const { title } = useContext(DataContext);

  
// //   const getPageMargins = () => {
// //     return `
// //       /* ... (código anterior) ... */
      
// //       @media print {
// //         /* Estilos generales para impresión */
// //         table {
// //           width: 100%;
// //         }
// //         .w-100 {
// //           width: 100% !important;
// //         }
// //         .css-spazkk-MuiContainer-root {
// //           max-width: 100% !important;
// //           width: 100% !important;
// //         }
// //       }
  
// //       @media print and (color) {
// //         /* Estilos específicos para la vista preliminar a color */
// //         body {
// //           background-color: #fff; /* Fondo blanco */
// //           color: #000; /* Texto negro u oscuro */
// //         }
// //         /* Puedes ajustar según tus necesidades */
// //       }
  
// //       @media print and (monochrome) {
// //         /* Estilos específicos para la vista preliminar en blanco y negro */
// //         body {
// //           background-color: #fff; /* Fondo blanco */
// //           color: #000; /* Texto negro u oscuro */
// //         }
// //         /* Puedes ajustar según tus necesidades */
// //       }
// //     `;
// //   };
  
  

// //   return (
// //     <div ref={ref}>
// //       <style>{getPageMargins()}</style>
// //       <Stack justifyContent={"space-between"} direction="row">
// //         <img
// //           loading="lazy"
// //           src={require("../media/Icono.png")}
// //           alt="logo"
// //           style={{ height: 50 }}
// //         />
// //         <Stack display="flex" justifyContent="center">
// //           <Typography
// //             sx={{
// //               textAlign: "center",
// //               fontWeight: "bold",
// //               fontSize: 11,
// //             }}
// //           >{`${title} - Chinandega`}</Typography>
// //           <Typography
// //             sx={{
// //               color: "#2196f3",
// //               textAlign: "center",
// //               fontSize: 11,
// //               fontWeight: "bold",
// //             }}
// //           >
// //             {props.titulo}
// //           </Typography>
// //           <span style={{ textAlign: "center", fontSize: 10 }}>
// //             {props.fecha}
// //           </span>
// //         </Stack>

// //         <img
// //           loading="lazy"
// //           src={require("../media/Icono.png")}
// //           alt="logo"
// //           style={{ height: 50 }}
// //         />
// //       </Stack>
// //       <div style={{ fontSize: 10 }}>{props.children}</div>
// //     </div>
// //   );
// // });