import React, { useRef, useContext } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faFileImport } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';
import { DataContext } from "../../context/DataContext";
import { addProductAsync } from "../../services/ProductsApi";
import { getToken, deleteToken, deleteUserData } from "../../services/Account";
import { guid, toastError, toastSuccess } from "../../helpers/Helpers";
import { useNavigate } from "react-router-dom";

const ProductExcelcharge = ({ ruta }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = getToken();
  
  const { 
    setIsLoading, 
    setIsDefaultPass, 
    setIsLogged,
    setReload,
    reload 
  } = useContext(DataContext);

  const generarPlantillaExcel = () => {
    const data = [
      {
        'Tipo Negocio ID': 1,
        'Familia ID': 1,
        'Descripción': 'EJEMPLO PRODUCTO',
        'Código Barras': '123456789',
        'Marca': 'MARCA EJEMPLO',
        'Modelo': 'MODELO EJEMPLO',
        'U/M': 'PIEZA'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    const wscols = [
      { wch: 15 },  // Tipo Negocio ID
      { wch: 15 },  // Familia ID
      { wch: 40 },  // Descripción
      { wch: 20 },  // Código Barras
      { wch: 20 },  // Marca
      { wch: 20 },  // Modelo
      { wch: 10 },  // U/M
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, "plantilla_productos.xlsx");
  };

  const procesarExcel = async (file) => {
    try {
      setIsLoading(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const productos = XLSX.utils.sheet_to_json(firstSheet);

          for (const producto of productos) {
            const productoFormateado = {
              TipoNegocioId: parseInt(producto['Tipo Negocio ID']),
              FamiliaId: parseInt(producto['Familia ID']),
              description: producto['Descripción'].toString().toUpperCase(),
              barCode: producto['Código Barras']?.toString() || 
                `A&M${Math.floor(Math.random() * (1 - 100)) + 1}-${guid()}`,
              marca: producto['Marca']?.toString().toUpperCase() || "S/M",
              modelo: producto['Modelo']?.toString().toUpperCase() || "S/M",
              uM: producto['U/M']?.toString() || "S/UM"
            };

            const result = await addProductAsync(token, productoFormateado);
            if (!result.statusResponse) {
              setIsLoading(false);
              if (result.error.request.status === 401) {
                navigate(`${ruta}/unauthorized`);
                return;
              }
              toastError(result.error.message);
              return;
            }

            if (result.data === "eX01") {
              setIsLoading(false);
              deleteUserData();
              deleteToken();
              setIsLogged(false);
              return;
            }

            if (result.data.isDefaultPass) {
              setIsLoading(false);
              setIsDefaultPass(true);
              return;
            }
          }

          setIsLoading(false);
          toastSuccess("Productos importados correctamente");
          setReload(!reload);
        } catch (error) {
          setIsLoading(false);
          toastError("Error al procesar el archivo Excel");
          console.error("Error:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setIsLoading(false);
      toastError("Error al leer el archivo Excel");
      console.error("Error:", error);
    }
  };

  const manejarCargaArchivo = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      procesarExcel(archivo);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={manejarCargaArchivo}
      />
      
      <Button
        variant="outlined"
        style={{ borderRadius: 20 }}
        startIcon={<FontAwesomeIcon icon={faFileDownload} />}
        onClick={generarPlantillaExcel}
      >
        Plantilla Excel
      </Button>

      <Button
        variant="outlined"
        style={{ borderRadius: 20 }}
        startIcon={<FontAwesomeIcon icon={faFileImport} />}
        onClick={() => fileInputRef.current.click()}
      >
        Importar Excel
      </Button>
    </>
  );
};

export default ProductExcelcharge;
