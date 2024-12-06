import React, { useRef,useState } from "react";
import { IconButton, Stack } from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReactToPrint from "react-to-print";
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';
import { Bill } from "./Bill";

export const BillComponent = ({ data, setShowModal }) => {
  const compRef = useRef();
  const [printerType, setPrinterType] = useState('normal');

  const generatePDF = async () => {
    const element = compRef.current;
    const opt = {
      margin: [5, 5],
      filename: 'factura.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: [80, 297],
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
            margin: [5, 5],  // Ajustado para factura térmica
            filename: 'factura.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: [80, 297],  // Formato típico de factura térmica
                orientation: 'portrait' 
            }
        };

        // Primero generamos el PDF y obtenemos el blob
        const pdfDoc = await html2pdf().set(opt).from(element).output('blob');
        
        // Crear el archivo PDF
        const pdfFile = new File([pdfDoc], 'factura.pdf', { type: 'application/pdf' });

        // Crear mensaje de WhatsApp
        const message = `*Factura - ${data.nombreCliente || "Cliente Eventual"}*\n` +
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
                        title: 'Factura',
                        text: message
                    });
                } catch (error) {
                    console.error("Error al compartir:", error);
                    window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
                }
            } else {
                window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
            }
        } else {
            // En desktop, crear una URL temporal para el archivo
            const fileUrl = URL.createObjectURL(pdfFile);

            try {
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                    await navigator.share({
                        files: [pdfFile],
                        title: 'Factura',
                        text: message
                    });
                } else {
                    // Descargar PDF y abrir WhatsApp Web
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.download = 'factura.pdf';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
                }
            } catch (error) {
                console.error("Error al compartir:", error);
                window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
            } finally {
                URL.revokeObjectURL(fileUrl);
            }
        }
    } catch (error) {
        console.error("Error general:", error);
        alert("Hubo un error al generar la factura. Por favor, intente nuevamente.");
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

      <div style={{ width: 300, display: "none" }}>
        {/* <Bill data={data} ref={compRef} /> */}        
        {data && <Bill data={data} ref={compRef} />}
      </div>
    </div>
  );
};