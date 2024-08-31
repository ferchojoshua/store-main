import React, { useRef } from "react";
import { IconButton, Stack } from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Proforma from "./Proforma";

const ProformaComponent = ({ data }) => {
  const compRef = useRef();

  // Función para generar el PDF desde el componente Proforma
  const generatePDF = async () => {
    try {
      console.log("Generando canvas...");
      const canvas = await html2canvas(compRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      console.log("Imagen generada:", imgData);

      // Verificar si imgData es una URL válida
      if (!imgData || !imgData.startsWith("data:image/png;base64,")) {
        throw new Error("No se pudo generar la imagen PNG.");
      }

      const pdf = new jsPDF("p", "pt", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;
      }

      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, intenta nuevamente.");
      throw error;
    }
  };

  // Función para manejar la descarga del PDF
  const handleDownloadPDF = async () => {
    try {
      const pdf = await generatePDF();
      pdf.save("proforma.pdf");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  // Función para compartir en WhatsApp el PDF generado
  const handleWhatsAppShare = async () => {
    try {
      const pdf = await generatePDF();
      const blob = pdf.output("blob");
      const fileURL = URL.createObjectURL(blob);
      const whatsappMessage = `Proforma - Cliente: ${data.nombreCliente || "Cliente Eventual"}\nMonto Total: ${new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO" }).format(data.montoVenta)}\nPuedes ver el archivo PDF aquí: ${fileURL}`;
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappURL, "_blank");
    } catch (error) {
      console.error("Error sharing PDF on WhatsApp:", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <hr />
      <Stack direction="row" justifyContent="center" spacing={2}>
        {/* Botón de Imprimir */}
        <ReactToPrint
          trigger={() => (
            <IconButton variant="outlined">
              <PrintRoundedIcon style={{ fontSize: 40, color: "#2979ff" }} />
            </IconButton>
          )}
          content={() => compRef.current}
        />

        {/* Botón de WhatsApp */}
        {/* <IconButton
          onClick={handleWhatsAppShare}
          style={{
            color: "#25D366",
            borderRadius: "75%",
            width: 50,
            height: 50,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
                backgroundColor: "transparent", // Elimina el fondo blanco
    overflow: "hidden", // Asegura que el contenido se ajuste al contenedor circular
          }}
        >
          <img
            loading="lazy"
            src={require("../../../../../src/components/media/whatsapp.png")}
            alt="WhatsApp"
            style={{ width: 40, height: 40, objectFit: "cover" }}
          />
        </IconButton> */}

        {/* Botón de Descargar PDF */}
        <IconButton
  onClick={handleDownloadPDF}
  style={{
    color: "#f44336",
    borderRadius: "50%",
    width: 50,
    height: 50,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    display : "none",
    backgroundColor: "transparente", // Elimina el fondo blanco
    overflow: "hidden", // Asegura que el contenido se ajuste al contenedor circular
  }}
>
  <img
    loading="lazy"
    src={require("../../../../../src/components/media/pdf.png")}
    alt="PDF"
    style={{
      width: '100%',   // Hace que la imagen llene el contenedor
      height: '100%',  // Hace que la imagen llene el contenedor
      objectFit: 'cover', // Mantiene la proporción de la imagen y cubre el contenedor
    }}
  />
</IconButton>

      </Stack>

      {/* Factura oculta fuera de la vista */}
      <div style={{ width: '100%', display: "none" }}>
        <Proforma data={data} ref={compRef} />
      </div>
    </div>
  );
};

export default ProformaComponent;






// import React, { useRef } from "react";
// import { IconButton } from "@mui/material";
// import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
// import ReactToPrint from "react-to-print";
// import Proforma from "./Proforma";
// import jsPDF from "jspdf";

// const ProformaComponent = ({ data, setShowModal }) => {
//   const compRef = useRef();

//   return (
//     <div
//       style={{
//         textAlign: "center",
//       }}
//     >
//       <hr />

//       <ReactToPrint
//         trigger={() => {
//           return (
//             <IconButton variant="outlined">
//               <PrintRoundedIcon
//                 style={{ fontSize: 70, color: "#2979ff", width: 70 }}
//               />
//             </IconButton>
//           );
//         }}
//         content={() => compRef.current}
//       />

//       <div
//         style={{
//           width: 300,
//           display: "none",
//         }}
//       >
//         <Proforma data={data} ref={compRef} />
//       </div>
      
//     </div>
//   );
// };

// export default ProformaComponent;




// import React, { useRef } from "react";
// import { IconButton, Stack } from "@mui/material";
// import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
// import ReactToPrint from "react-to-print";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Proforma from "./Proforma";

// const ProformaComponent = ({ data }) => {
//   const compRef = useRef();


//   const thermalStyles = {
//     width: '58mm',  // Ancho común de rollos de papel térmico
//     fontSize: '10pt',
//     padding: '5mm',
//     position: "absolute",
//     left: "-9999px",  // Mantener fuera de la vista pero renderizado
//   };


//   // Función para generar el PDF desde el componente Proforma
//   const generatePDF = async () => {
//     const canvas = await html2canvas(compRef.current, {
//       scale: 2,
//       useCORS: true,
//       windowWidth: document.documentElement.offsetWidth,
//       windowHeight: document.documentElement.offsetHeight,
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "pt", "a4");
//     const imgWidth = (canvas.width * 0.75); // Ajuste para mantener la escala
//     const imgHeight = (canvas.height * 0.75);
//     let heightLeft = imgHeight;
//     let position = 10;

//     pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//     heightLeft -= pdf.internal.pageSize.height;

//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= pdf.internal.pageSize.height;
//     }

//     return pdf;
//   };

//   // Función para manejar la descarga del PDF
//   const handleDownloadPDF = async () => {
//     const pdf = await generatePDF();
//     pdf.save("proforma.pdf");
//   };

//   // Función para compartir en WhatsApp el PDF generado
//   const handleWhatsAppShare = async () => {
//     const pdf = await generatePDF();
//     const blob = pdf.output("blob");

//     const fileURL = URL.createObjectURL(blob);

//     const whatsappMessage = `Proforma - Cliente: ${
//       data.nombreCliente || "Cliente Eventual"
//     }\nMonto Total: ${
//       new Intl.NumberFormat("es-NI", {
//         style: "currency",
//         currency: "NIO",
//       }).format(data.montoVenta)
//     }\nPuedes ver el archivo PDF aquí: ${fileURL}`;

//     const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
//     window.open(whatsappURL, "_blank");
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <hr />

//       <Stack direction="row" justifyContent="center" spacing={2}>
//         {/* Botón de Imprimir */}
//         <ReactToPrint
//           trigger={() => (
//             <IconButton variant="outlined">
//               <PrintRoundedIcon style={{ fontSize: 40, color: "#2979ff" }} />
//             </IconButton>
//           )}
//           content={() => compRef.current}
//         />

//         {/* Botón de WhatsApp */}
//         {/* <IconButton
//           onClick={handleWhatsAppShare}
//           style={{
//             color: "#25D366",
//             borderRadius: "50%",
//             width: 50,
//             height: 50,
//             padding: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "#fff",
//           }}
//         >
//           <img
//             loading="lazy"
//             src={require("../../../../../src/components/media/whatsapp.png")}
//             alt="WhatsApp"
//             style={{
//               width: 40,
//               height: 40,
//               objectFit: "cover",
//             }}
//           />
//         </IconButton> */}

//         {/* Botón de Descargar PDF */}
//         {/* <IconButton
//           onClick={handleDownloadPDF}
//           style={{
//             color: "#f44336",
//             borderRadius: "50%",
//             width: 50,
//             height: 50,
//             padding: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "#fff",
//           }}
//         >
//           <img
//             loading="lazy"
//             src={require("../../../../../src/components/media/pdf.png")}
//             alt="PDF"
//             style={{
//               width: 40,
//               height: 40,
//               objectFit: "cover",
//             }}
//           />
//         </IconButton> */}
//       </Stack>

  
//            {/* Factura oculta fuera de la vista */}
//            <div style={thermalStyles}>
//         <Proforma data={data} ref={compRef} />
//       </div>
//     </div>
//   );
// };

// export default ProformaComponent;