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
      // Capturar el canvas desde el componente
      const canvas = await html2canvas(compRef.current, {
        scale: 2,
        useCORS: true,
      });
  
      // Verifica que el canvas se ha generado correctamente
      if (!canvas || !canvas.toDataURL) {
        throw new Error("Error al capturar el canvas.");
      }
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgWidth = 210; // Ancho en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener la proporción
      let heightLeft = imgHeight;
      let position = 0;
  
      // Añadir la primera página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;
  
      // Añadir páginas adicionales si el contenido es más largo que una página
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
      throw error; // Lanza el error para manejarlo en `handleDownloadPDF` o `handleWhatsAppShare`
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
        <IconButton
          onClick={handleWhatsAppShare}
          style={{
            color: "#25D366",
            borderRadius: "50%",
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
        </IconButton>

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
            backgroundColor: "transparent", // Elimina el fondo blanco
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
