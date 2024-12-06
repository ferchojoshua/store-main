import React, { useRef, useState } from "react";
import { 
  IconButton, 
  Stack, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReactToPrint from "react-to-print";
import html2pdf from 'html2pdf.js';
import Proforma from "./Proforma";

const ProformaComponent = ({ data }) => {
  const compRef = useRef();
  const [printerType, setPrinterType] = useState('normal');

  const generatePDF = async () => {
    const element = compRef.current;
    const opt = {
      margin: printerType === 'thermal' ? [5, 5] : [10, 10],
      filename: 'proforma.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: printerType === 'thermal' ? [80, 297] : 'a4', 
        orientation: 'portrait' 
      }
    };

    try {
      const pdf = await html2pdf().set(opt).from(element).save();
      return pdf;
    } catch (error) {
      console.error("Error generando PDF:", error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    }
  };

  const handleWhatsAppShare = async () => {
    try {
        const element = compRef.current;
        const opt = {
            margin: printerType === 'thermal' ? [5, 5] : [10, 10],
            filename: 'proforma.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: printerType === 'thermal' ? [80, 297] : 'a4', 
                orientation: 'portrait' 
            }
        };

        // Primero generamos el PDF y obtenemos el blob
        const pdfDoc = await html2pdf().set(opt).from(element).output('blob');
        
        // Crear el archivo PDF
        const pdfFile = new File([pdfDoc], 'proforma.pdf', { type: 'application/pdf' });

        // Crear mensaje de WhatsApp
        const message = `*Proforma - ${data.nombreCliente || "Cliente Eventual"}*\n` +
            `Monto Total: ${new Intl.NumberFormat("es-NI", { 
                style: "currency", 
                currency: "NIO" 
            }).format(data.montoVenta)}`;

        // Detectar si es móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            // En móvil, usar la API de compartir nativa
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                try {
                    await navigator.share({
                        files: [pdfFile],
                        title: 'Proforma',
                        text: message
                    });
                } catch (error) {
                    console.error("Error al compartir:", error);
                    // Si falla, intentar compartir solo el mensaje por WhatsApp
                    window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
                }
            } else {
                // Si no hay soporte para compartir archivos, usar WhatsApp directamente
                window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
            }
        } else {
            // En desktop, crear una URL temporal para el archivo
            const fileUrl = URL.createObjectURL(pdfFile);

            try {
                // Intentar usar la API de compartir del sistema si está disponible
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                    await navigator.share({
                        files: [pdfFile],
                        title: 'Proforma',
                        text: message
                    });
                } else {
                    // Si no está disponible, abrir el selector de aplicación del sistema
                    const shareData = {
                        title: 'Proforma',
                        text: message,
                        files: [pdfFile]
                    };

                    if (window.showOpenFilePicker) {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: 'proforma.pdf',
                            types: [{
                                description: 'PDF Files',
                                accept: { 'application/pdf': ['.pdf'] }
                            }]
                        });
                        const writable = await handle.createWritable();
                        await writable.write(pdfFile);
                        await writable.close();
                    }
                }
            } catch (error) {
                console.error("Error al compartir:", error);
                // Como último recurso, abrir WhatsApp Web
                window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
            } finally {
                // Limpiar la URL temporal
                URL.revokeObjectURL(fileUrl);
            }
        }
    } catch (error) {
        console.error("Error general:", error);
        alert("Hubo un error al generar el PDF. Por favor, intente nuevamente.");
    }
};

  return (
    <div style={{ textAlign: "center" }}>
      <hr />
      <Stack direction="row" justifyContent="center" spacing={2}>
        <ReactToPrint
          trigger={() => (
            <IconButton variant="outlined">
              <PrintRoundedIcon style={{ fontSize: 40, color: "#2979ff" }} />
            </IconButton>
          )}
          content={() => compRef.current}
        />

        <IconButton
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
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <img
            loading="lazy"
            src={require("../../../../../src/components/media/whatsapp.png")}
            alt="WhatsApp"
            style={{ width: 40, height: 40, objectFit: "cover" }}
          />
        </IconButton>

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
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <img
            loading="lazy"
            src={require("../../../../../src/components/media/pdf.png")}
            alt="PDF"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </IconButton>
      </Stack>

      <div style={{ display: "none" }}>
        <Proforma 
          data={{ ...data, printerType }} 
          ref={compRef} 
        />
      </div>
    </div>
  );
};

export default ProformaComponent;